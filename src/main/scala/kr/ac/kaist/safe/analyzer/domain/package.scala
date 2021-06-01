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

package kr.ac.kaist.safe.analyzer

import kr.ac.kaist.safe.nodes.cfg.{ CFG, FunctionId }
import kr.ac.kaist.safe.errors.error._
import kr.ac.kaist.safe.util.{ PredAllocSite, HashMap }

import spray.json._

package object domain {
  ////////////////////////////////////////////////////////////////
  // value alias
  ////////////////////////////////////////////////////////////////
  lazy val AT = AbsBool.True
  lazy val AF = AbsBool.False
  val T = Bool(true)
  val F = Bool(false)

  ////////////////////////////////////////////////////////////////
  // value constructors
  ////////////////////////////////////////////////////////////////
  val ExcSetEmpty: Set[Exception] = Set[Exception]()
  val ExcSetTop: Set[Exception] = null // TODO refactoring

  val FidSetEmpty: Set[FunctionId] = Set[FunctionId]()

  ////////////////////////////////////////////////////////////////
  // constant values
  ////////////////////////////////////////////////////////////////
  val STR_DEFAULT_OTHER = "@default_other"
  val STR_DEFAULT_NUMBER = "@default_number"
  val DEFAULT_KEYSET = Set(STR_DEFAULT_NUMBER, STR_DEFAULT_OTHER)

  ////////////////////////////////////////////////////////////////
  // string value helper functions
  ////////////////////////////////////////////////////////////////
  /* regexp, number string */
  private val hex = "(0[xX][0-9a-fA-F]+)".r.pattern
  private val exp = "[eE][+-]?[0-9]+"
  private val dec1 = "[0-9]+\\.[0-9]*(" + exp + ")?"
  private val dec2 = "\\.[0-9]+(" + exp + ")?"
  private val dec3 = "[0-9]+(" + exp + ")?"
  private val dec = "([+-]?(Infinity|(" + dec1 + ")|(" + dec2 + ")|(" + dec3 + ")))"
  private val numRegexp = ("NaN|(" + hex + ")|(" + dec + ")").r.pattern

  def isHex(str: String): Boolean =
    hex.matcher(str).matches()

  def isNumber(str: String): Boolean =
    numRegexp.matcher(str).matches()

  ////////////////////////////////////////////////////////////////
  // implicit conversion for concrete types of primitive values
  ////////////////////////////////////////////////////////////////
  // Boolean <-> Bool
  implicit def bool2boolean(b: Bool): Boolean = b.bool
  implicit def boolean2bool(b: Boolean): Bool = Bool(b)
  implicit def booleanSet2bool(set: Set[Boolean]): Set[Bool] = set.map(boolean2bool)

  // Double <-> Num
  implicit def num2double(num: Num): Double = num.num
  implicit def double2num(num: Double): Num = Num(num)
  implicit def doubleSet2num(set: Set[Double]): Set[Num] = set.map(double2num)

  // String <-> Str
  implicit def str2string(str: Str): String = str.str
  implicit def string2str(str: String): Str = Str(str)
  implicit def stringSet2str(set: Set[String]): Set[Str] = set.map(string2str)

  ////////////////////////////////////////////////////////////////
  // implicit conversion for abstract domains
  ////////////////////////////////////////////////////////////////
  // primitive abstract domains -> AbsPValue
  implicit def undef2pv(undef: AbsUndef): AbsPValue = AbsPValue(undefval = undef)
  implicit def null2pv(x: AbsNull): AbsPValue = AbsPValue(nullval = x)
  implicit def bool2pv(b: AbsBool): AbsPValue = AbsPValue(boolval = b)
  implicit def num2pv(num: AbsNum): AbsPValue = AbsPValue(numval = num)
  implicit def str2pv(str: AbsStr): AbsPValue = AbsPValue(strval = str)

  // location -> LocSet
  implicit def loc2locset(loc: Loc): LocSet = LocSet(loc)

  // AbsPValue -> AbsValue
  implicit def pv2v[T <% AbsPValue](pv: T): AbsValue = AbsValue(pv)

  // LocSet -> AbsValue
  implicit def locset2v[T <% LocSet](loc: T): AbsValue = AbsValue(loc)

  // AbsValue -> AbsIValue
  implicit def v2iv[T <% AbsValue](v: T): AbsIValue = AbsIValue(v)

  // AbsFId -> AbsIValue
  implicit def fid2iv[T <% AbsFId](fid: T): AbsIValue = AbsIValue(fid)

  // AbsDecEnvRec, AbsGlobalEnvRec -> AbsEnvRec
  implicit def denv2env(dEnv: AbsDecEnvRec): AbsEnvRec = AbsEnvRec(dEnv)
  implicit def genv2env(gEnv: AbsGlobalEnvRec): AbsEnvRec = AbsEnvRec(gEnv)

  ////////////////////////////////////////////////////////////////
  // abstract domains
  ////////////////////////////////////////////////////////////////
  def register(
    absUndef: UndefDomain,
    absNull: NullDomain,
    absBool: BoolDomain,
    absNum: NumDomain,
    absStr: StrDomain,
    recencyMode: Boolean,
    heapClone: Boolean,
    sensitivity: Sensitivity
  ): Unit = {
    this.absUndef = Some(absUndef)
    this.absNull = Some(absNull)
    this.absBool = Some(absBool)
    this.absNum = Some(absNum)
    this.absStr = Some(absStr)
    this.recencyMode = Some(recencyMode)
    this.heapClone = Some(heapClone)
    this.sensitivity = Some(sensitivity)
  }

  // primitive values
  private var absUndef: Option[UndefDomain] = None
  lazy val AbsUndef: UndefDomain = get("UndefDomain", absUndef)
  type AbsUndef = AbsUndef.Elem

  private var absNull: Option[NullDomain] = None
  lazy val AbsNull: NullDomain = get("NullDomain", absNull)
  type AbsNull = AbsNull.Elem

  private var absBool: Option[BoolDomain] = None
  lazy val AbsBool: BoolDomain = get("BoolDomain", absBool)
  type AbsBool = AbsBool.Elem

  private var absNum: Option[NumDomain] = None
  lazy val AbsNum: NumDomain = get("NumDomain", absNum)
  type AbsNum = AbsNum.Elem

  private var absStr: Option[StrDomain] = None
  lazy val AbsStr: StrDomain = get("StrDomain", absStr)
  type AbsStr = AbsStr.Elem

  lazy val AbsPValue: DefaultPValue.type = DefaultPValue
  type AbsPValue = DefaultPValue.Elem

  // recency mode
  private var recencyMode: Option[Boolean] = None
  lazy val RecencyMode: Boolean = get("RecencyMode", recencyMode)

  // heap cloning mode
  private var heapClone: Option[Boolean] = None
  lazy val HeapClone: Boolean = get("HeapClone", heapClone)

  // trace sensitivity
  private var sensitivity: Option[Sensitivity] = None
  lazy val Sensitivity: Sensitivity = get("Sensitivity", sensitivity)

  // location set
  type LocSet = LocSet.Elem

  // value
  lazy val AbsValue: DefaultValue.type = DefaultValue
  type AbsValue = AbsValue.Elem

  // function id
  lazy val AbsFId: DefaultFId.type = DefaultFId
  type AbsFId = DefaultFId.Elem

  // internal value
  lazy val AbsIValue: DefaultIValue.type = DefaultIValue
  type AbsIValue = DefaultIValue.Elem

  // data property
  lazy val AbsDataProp: DefaultDataProp.type = DefaultDataProp
  type AbsDataProp = DefaultDataProp.Elem

  // descriptor
  lazy val AbsDesc: DefaultDesc.type = DefaultDesc
  type AbsDesc = DefaultDesc.Elem

  // absent value for parital map
  object AbsAbsent extends SimpleDomain[None.type] {
    def fromJSON(json: JsValue): Elem = json match {
      case JsString(str) if (str == "__TOP__") => Top
      case _ => Bot
    }
  }
  type AbsAbsent = AbsAbsent.Elem

  // execution context
  lazy val AbsBinding: DefaultBinding.type = DefaultBinding
  type AbsBinding = DefaultBinding.Elem

  lazy val AbsDecEnvRec: DefaultDecEnvRec.type = DefaultDecEnvRec
  type AbsDecEnvRec = DefaultDecEnvRec.Elem

  lazy val AbsGlobalEnvRec: DefaultGlobalEnvRec.type = DefaultGlobalEnvRec
  type AbsGlobalEnvRec = DefaultGlobalEnvRec.Elem

  lazy val AbsEnvRec: DefaultEnvRec.type = DefaultEnvRec
  type AbsEnvRec = DefaultEnvRec.Elem

  lazy val AbsLexEnv: DefaultLexEnv.type = DefaultLexEnv
  type AbsLexEnv = DefaultLexEnv.Elem

  lazy val AbsContext: DefaultContext.type = DefaultContext
  type AbsContext = DefaultContext.Elem

  // object
  lazy val AbsObj: CKeyObject.type = CKeyObject
  type AbsObj = CKeyObject.Elem

  // heap
  lazy val AbsHeap: DefaultHeap.type = DefaultHeap
  type AbsHeap = DefaultHeap.Elem

  // state
  lazy val AbsState: DefaultState.type = DefaultState
  type AbsState = DefaultState.Elem

  private def get[T](name: String, opt: Option[T]): T = opt match {
    case Some(choice) => choice
    case None => throw NotYetDefined(name)
  }

  type Map[K, V] = HashMap[K, V]
  val Map = HashMap

  // cache for JSON of GLOBAL_LOC
  var globalLocJSON: JsValue = null

  def debug(msg: String): Unit = System.err.println(msg)
}
