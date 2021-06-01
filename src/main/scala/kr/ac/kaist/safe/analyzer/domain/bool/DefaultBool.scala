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

package kr.ac.kaist.safe.analyzer.domain

import spray.json._
import kr.ac.kaist.safe.util.UIdObjMap

// default boolean abstract domain
object DefaultBool extends BoolDomain {
  case object Bot extends Elem
  case object True extends Elem
  case object False extends Elem
  case object Top extends Elem

  def alpha(bool: Bool): Elem = if (bool) True else False

  sealed abstract class Elem extends ElemTrait {
    def gamma: ConSet[Bool] = this match {
      case Bot => ConFin()
      case True => ConFin(true)
      case False => ConFin(false)
      case Top => ConFin(true, false)
    }

    def getSingle: ConSingle[Bool] = this match {
      case Bot => ConZero
      case True => ConOne(true)
      case False => ConOne(false)
      case Top => ConMany
    }

    override def toString: String = this match {
      case Bot => "⊥(boolean)"
      case True => "true"
      case False => "false"
      case Top => "Top(boolean)"
    }

    def toJSON(implicit uomap: UIdObjMap): JsValue = resolve {
      getSingle match {
        case ConOne(v) => v.toJSON
        case _ => fail
      }
    }

    def ToString: AbsStr = this match {
      case Bot => AbsStr.Bot
      case True => AbsStr("true")
      case False => AbsStr("false")
      case Top => AbsStr("true", "false")
    }

    def ToNumber: AbsNum = this match {
      case Bot => AbsNum.Bot
      case True => AbsNum(1)
      case False => AbsNum(+0)
      case Top => AbsNum(1, +0)
    }

    def ⊑(that: Elem): Boolean = (this, that) match {
      case (a, b) if a == b => true
      case (Bot, _) => true
      case (_, Top) => true
      case _ => false
    }

    def ⊔(that: Elem): Elem = (this, that) match {
      case (a, b) if a == b => this
      case (Bot, _) => that
      case (_, Bot) => this
      case _ => Top
    }

    def ⊓(that: Elem): Elem = (this, that) match {
      case (a, b) if a == b => this
      case (Top, _) => that
      case (_, Top) => this
      case _ => Bot
    }

    def StrictEquals(that: Elem): Elem = {
      (this, that) match {
        case (Bot, _) => Bot
        case (_, Bot) => Bot
        case (Top, _) => Top
        case (_, Top) => Top
        case (True, True) => True
        case (False, False) => True
        case _ => False
      }
    }

    def negate: Elem = this match {
      case True => False
      case False => True
      case _ => this
    }

    def &&(that: Elem): Elem = (this, that) match {
      case (Bot, _) | (_, Bot) => Bot
      case (False, _) | (_, False) => False
      case (True, True) => True
      case _ => Top
    }

    def ||(that: Elem): Elem = (this, that) match {
      case (Bot, _) | (_, Bot) => Bot
      case (True, _) | (_, True) => True
      case (False, False) => False
      case _ => Top
    }

    def xor(that: Elem): Elem = (this, that) match {
      case (Bot, _) | (_, Bot) => Bot
      case (True, False) | (False, True) => True
      case (False, False) | (True, True) => False
      case _ => Top
    }
  }

  def fromJSON(json: JsValue)(implicit uomap: UIdObjMap): Elem = json match {
    case JsBoolean(bool) => if (bool) True else False
    case JsString(str) if (str == "__TOP__") => Top
    case _ => Bot
  }
}
