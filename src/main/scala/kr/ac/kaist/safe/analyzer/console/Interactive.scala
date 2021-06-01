/*
 * ****************************************************************************
 * Copyright (c) 2016-2018, KAIST.
 * All rights reserved.
 *
 * Use is subject to license terms.
 *
 * This distribution may include materials developed by third parties.
 * ***************************************************************************
 */

package kr.ac.kaist.safe.analyzer.console

import kr.ac.kaist.safe.analyzer.console.command._
import kr.ac.kaist.safe.analyzer.domain.AbsState
import kr.ac.kaist.safe.analyzer.{ ControlPoint, Semantics, Worklist }
import kr.ac.kaist.safe.nodes.cfg.{ CFG, CFGBlock, ExitExc }
import kr.ac.kaist.safe.phase.HeapBuildConfig
import scala.collection.immutable.TreeSet

trait Interactive {
  val cfg: CFG
  val sem: Semantics
  val config: HeapBuildConfig
  var iter: Int = -1
  var visited: Set[ControlPoint] = Set()
  var stopAlreadyVisited: Boolean = false
  var stopExitExc: Boolean = false
  var debugMode: Boolean = false
  var showIter: Boolean = false
  var startTime: Long = 0
  var beforeTime: Long = 0
  val INTERVAL: Long = 1000 // 1 seccond

  ////////////////////////////////////////////////////////////////
  // private variables
  ////////////////////////////////////////////////////////////////

  protected var target: Target = TargetStart
  protected var cur: ControlPoint = _
  protected var home: ControlPoint = _
  protected var breakList: TreeSet[CFGBlock] = TreeSet()

  ////////////////////////////////////////////////////////////////
  // API
  ////////////////////////////////////////////////////////////////

  def worklist: Worklist = sem.worklist
  def runFixpoint: Unit
  def prepareToRunFixpoint: Boolean = {
    iter += 1
    cur = worklist.head
    home = cur
    val block = cur.block

    val targetB = (target match {
      case TargetStart => iter == 0
      case TargetIter(k) => iter == k
      case _ => false
    })
    val breakB = breakList(block)
    val excStop = (debugMode || stopExitExc) && (block match {
      case ExitExc(f) =>
        val exitCP = ControlPoint(f.exit, cur.tracePartition)
        val exitSt = sem.getState(exitCP)
        exitSt.isBottom
      case _ => false
    })
    targetB || breakB || excStop
  }

  def runCmd(line: String): CmdResult = {
    line match {
      case null =>
        target = NoTarget; CmdResultBreak()
      case "" =>
        target = TargetIter(iter + 1); CmdResultBreak()
      case _ =>
        val list = line.trim.split("\\s+").toList
        val cmd = list.head
        val args = list.tail
        Command.cmdMap.get(cmd) match {
          case Some(o) =>
            o.run(this, args) match {
              case Some(TargetStart) =>
                target = TargetStart
                iter = -1
                CmdResultRestart
              case Some(t) =>
                target = t
                CmdResultBreak(o.result())
              case None => CmdResultContinue(o.result())
            }
          case None => CmdResultContinue(s"* $cmd: command not found")
        }
    }
  }
  def runFinished(): Unit = println("* analysis finished")

  def getIter: Int = iter
  def getCurCP: ControlPoint = cur
  def moveCurCP(block: CFGBlock): Unit

  def goHome(): Unit = {
    if (cur != home) cur = home
  }

  def addBreak(block: CFGBlock): Unit = breakList += block
  def getBreakList: List[CFGBlock] = breakList.toList
  def removeBreak(block: CFGBlock): Unit = breakList -= block

  def getResult: (AbsState, AbsState) = {
    val cp = getCurCP
    val st = sem.getState(cp)
    sem.C(cp, st)
  }

  def getPrompt: String
}

sealed abstract class CmdResult(
    val output: String = ""
) {
  override def toString: String = output
}

case class CmdResultContinue(override val output: String = "") extends CmdResult(output)
case class CmdResultBreak(override val output: String = "") extends CmdResult(output)
case object CmdResultRestart extends CmdResult
