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

// default null abstract domain
object DefaultNull extends NullDomain {
  case object Top extends Elem
  case object Bot extends Elem

  def alpha(x: Null): Elem = Top

  sealed abstract class Elem extends ElemTrait {
    def gamma: ConSet[Null] = this match {
      case Bot => ConFin()
      case Top => ConFin(Null)
    }

    def getSingle: ConSingle[Null] = this match {
      case Bot => ConZero
      case Top => ConOne(Null)
    }

    override def toString: String = this match {
      case Bot => "⊥(null)"
      case Top => "Top(null)"
    }

    def toJSON(implicit uomap: UIdObjMap): JsValue = resolve {
      getSingle match {
        case ConOne(v) => v.toJSON
        case _ => fail
      }
    }

    def ⊑(that: Elem): Boolean = (this, that) match {
      case (Top, Bot) => false
      case _ => true
    }

    def ⊔(that: Elem): Elem = (this, that) match {
      case (Bot, Bot) => Bot
      case _ => Top
    }

    def ⊓(that: Elem): Elem = (this, that) match {
      case (Top, Top) => Top
      case _ => Bot
    }

    def StrictEquals(that: Elem): AbsBool = (this, that) match {
      case (Top, Top) => AbsBool.True
      case _ => AbsBool.Bot
    }
  }

  def fromJSON(json: JsValue)(implicit uomap: UIdObjMap): Elem = json match {
    case JsString(str) if (str == "__TOP__") => Top
    case _ => Bot
  }
}
