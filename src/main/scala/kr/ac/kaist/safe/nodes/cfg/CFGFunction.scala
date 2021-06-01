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
import kr.ac.kaist.safe.{ LINE_SEP, SIGNIFICANT_BITS }
import kr.ac.kaist.safe.nodes.ir.IRNode
import kr.ac.kaist.safe.util._

import kr.ac.kaist.safe.nodes.ast.ASTNode

case class CFGFunction(
    ir: IRNode,
    argumentsName: String,
    argVars: List[CFGId],
    localVars: List[CFGId],
    name: String,
    isUser: Boolean,
    ast: Option[ASTNode]
) extends CFGNode {
  var id: FunctionId = 0 // XXX should be a value but for JS model for a while.

  val entry = Entry(this)
  val exit = Exit(this)
  val exitExc = ExitExc(this)

  private var bidCount: BlockId = 0
  def getBId: BlockId = bidCount

  private var outerVars: Set[CFGId] = Set()
  def addOuterVar(id: CFGId): Unit = outerVars += id
  def getOuterVars: Set[CFGId] = outerVars

  // all blocks in this function
  private var blocks: List[CFGBlock] = List(exitExc, exit, entry)
  private var blockMap: MMap[BlockId, CFGBlock] = MMap(
    -1 -> entry,
    -2 -> exit,
    -3 -> exitExc
  )
  def getBlock(bid: BlockId): Option[CFGBlock] = blockMap.get(bid)
  def getAllBlocks: List[CFGBlock] = blocks

  // out blocks
  var outBlocks: List[CFGBlock] = List(exit, exitExc)

  // append block
  private def addBlock(block: CFGBlock): CFGBlock = {
    bidCount += 1
    blocks ::= block
    blockMap(block.id) = block
    block
  }

  // create call
  def createCall(callInstCons: Call => CFGCallInst, retVar: CFGId, outer: Option[LoopHead]): Call = {
    val call = Call(this, callInstCons, retVar)
    val afterCall = call.afterCall
    val afterCatch = call.afterCatch
    call.outerLoop = outer
    afterCall.outerLoop = outer
    afterCatch.outerLoop = outer
    addBlock(call)
    addBlock(afterCall)
    addBlock(afterCatch)
    call
  }

  // create block
  def createBlock(outer: Option[LoopHead]): NormalBlock = createBlock(NoLabel, outer)
  def createBlock(label: LabelKind, outer: Option[LoopHead]): NormalBlock = {
    val block = NormalBlock(this, label)
    block.outerLoop = outer
    addBlock(block)
    block
  }
  def createLoopHead(outer: Option[LoopHead], cond: CFGExpr, span: Span): LoopHead = {
    val loopHead = LoopHead(this, cond, span)
    loopHead.outerLoop = outer
    addBlock(loopHead)
    loopHead
  }

  // TODO: PureLocal - may not need to distinguish Captured
  // captured variable list for each function
  private var captured: List[CFGId] = Nil
  def addCaptured(captId: CFGId): Unit = captured ::= captId
  def getCaptured: List[CFGId] = captured

  // equals
  override def equals(other: Any): Boolean = other match {
    case (func: CFGFunction) => func.id == id
    case _ => false
  }

  // toString
  override def toString: String = s"function[$id] $name"
  override def toString(indent: Int): String = {
    val pre = "  " * indent
    val s: StringBuilder = new StringBuilder
    s.append(pre).append(s"function[$id] ")
      .append(NodeUtil.isInternal(name) match {
        case true => name.dropRight(SIGNIFICANT_BITS)
        case false => name
      })
      .append(" {").append(LINE_SEP)
    blocks.reverseIterator.foreach {
      case Exit(_) | ExitExc(_) =>
      case block =>
        s.append(pre).append(block.toString(indent + 1)).append(LINE_SEP)
    }
    s.append(pre).append(exit.toString(indent + 1)).append(LINE_SEP)
    s.append(pre).append(exitExc.toString(indent + 1)).append(LINE_SEP)
    s.append(pre).append("}").append(LINE_SEP)
    s.toString
  }

  def toCode(): Map[BlockId, (Map[CFGEdgeType, List[BlockId]], String)] = {
    blocks.reverseIterator.foldLeft[Map[BlockId, (Map[CFGEdgeType, List[BlockId]], String)]](Map())({
      case (acc, block) =>
        acc + (block.id -> block.toCode)
    })
  }

  def simpleName: String = {
    val arr = name.split(NodeUtil.INTERNAL_SYMBOL)
    if (arr.head.isEmpty) arr.tail.head
    else arr.head
  }
}
