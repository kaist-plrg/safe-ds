/**
 * *****************************************************************************
 * Copyright (c) 2016-2018, KAIST.
 * All rights reserved.
 *
 * Use is subject to license terms.
 *
 * This distribution may include materials developed by third parties.
 * ****************************************************************************
 */

package kr.ac.kaist.safe.nodes.cfg

import scala.collection.mutable.{ Map => MMap }
import scala.util.{ Try, Success, Failure }
import kr.ac.kaist.safe.LINE_SEP
import kr.ac.kaist.safe.analyzer.domain.Loc
import kr.ac.kaist.safe.errors.error._
import kr.ac.kaist.safe.nodes.ir.IRNode
import kr.ac.kaist.safe.util._

import kr.ac.kaist.safe.nodes.ast.{ ASTNode, Program }

case class CFG(
    ir: IRNode,
    globalVars: List[CFGId]
) extends CFGNode {
  type CCFG = Map[FunctionId, Map[BlockId, (Map[CFGEdgeType, List[BlockId]], String)]]
  // cfg id
  val id: Int = CFG.getId

  // get functions / blocks in this cfg
  private def getBlocks(funcs: List[CFGFunction]): List[CFGBlock] =
    funcs.foldRight(List[CFGBlock]())(_.getAllBlocks ++ _)

  private var funcs: List[CFGFunction] = Nil
  def getAllFuncs: List[CFGFunction] = funcs
  def getAllBlocks: List[CFGBlock] = getBlocks(funcs)

  private var userFuncs: List[CFGFunction] = Nil
  def getUserFuncs: List[CFGFunction] = userFuncs
  def getUserBlocks: List[CFGBlock] = getBlocks(userFuncs)

  // function / block map from id
  private val funMap: MMap[FunctionId, CFGFunction] = MMap()
  def getFunc(fid: FunctionId): Option[CFGFunction] = funMap.get(fid)
  def getBlock(fid: FunctionId, bid: BlockId): Option[CFGBlock] =
    funMap.get(fid).fold[Option[CFGBlock]](None) { _.getBlock(bid) }

  private var fidCount: FunctionId = 0
  def getFId: FunctionId = fidCount

  // global function
  lazy val globalFunc: CFGFunction =
    createFunction("", Nil, globalVars, "top-level", ir, true, Some(ir.ast match {
      case Program(info, body) => body
      case _ => ir.ast
    }))

  // create function
  def createFunction(
    argumentsName: String,
    argVars: List[CFGId],
    localVars: List[CFGId],
    name: String,
    ir: IRNode,
    isUser: Boolean,
    ast: Option[ASTNode]
  ): CFGFunction = {
    val func: CFGFunction =
      new CFGFunction(ir, argumentsName, argVars, localVars, name, isUser, ast)
    func.id = getFId
    fidCount += 1
    funcs ::= func
    if (func.isUser) userFuncs ::= func
    funMap(func.id) = func
    func
  }

  // add JS model
  ////////////////////////////////
  def addJSModel(
    func: CFGFunction
  ): Unit = {
    funcs ::= func
    funMap(func.id) = func
  }

  // add edge
  def addEdge(
    fromList: List[CFGBlock],
    toList: List[CFGBlock],
    etype: CFGEdgeType = CFGEdgeNormal
  ): Unit = {
    fromList.foreach((from) => toList.foreach((to) => {
      from.addSucc(etype, to)
      to.addPred(etype, from)
    }))
  }

  // toString
  override def toString(indent: Int): String = {
    val s: StringBuilder = new StringBuilder
    funcs.reverseIterator.foreach {
      case func => s.append(func.toString(indent)).append(LINE_SEP)
    }
    s.toString
  }

  // toString
  def toCode(): CCFG = {
    funcs.reverseIterator.foldLeft[CCFG](Map())({
      case (acc, func) => acc + (func.id -> func.toCode)
    })
  }

  // user defined allocation site size
  private var userASiteSize: Int = 0
  def getUserASiteSize: Int = userASiteSize
  def setUserASiteSize(size: Int): Unit = { userASiteSize = size }
  def newUserASite: UserAllocSite = {
    userASiteSize += 1
    val asite = UserAllocSite(userASiteSize)
    asite
  }

  // find block from a given string
  def findBlock(str: String): Try[CFGBlock] = {
    val idPattern = "(-?\\d+):(\\d+)".r
    val spPattern = "(-?\\d+):(entry|exit|exit-exc)".r
    str match {
      case idPattern(fidStr, bidStr) => {
        val fid = fidStr.toInt
        val bid = bidStr.toInt
        getFunc(fid) match {
          case Some(func) => func.getBlock(bid) match {
            case Some(block) => Success(block)
            case None => Failure(NoBlockIdError(fid, bid))
          }
          case None => Failure(NoFuncIdError(fid))
        }
      }
      case spPattern(fidStr, sp) => {
        val fid = fidStr.toInt
        getFunc(fid) match {
          case Some(func) => Success(sp match {
            case "entry" => func.entry
            case "exit" => func.exit
            case _ => func.exitExc
          })
          case None => Failure(NoFuncIdError(fid))
        }
      }
      case _ => Failure(IllFormedBlockStr)
    }
  }
}

object CFG {
  private var idCount: Int = 0
  private def getId: Int = { val id = idCount; idCount += 1; id }
}
