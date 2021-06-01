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

package kr.ac.kaist.safe.nodes.ast

trait SourceElement extends ASTNode

// Program ::= SourceElement*
case class SourceElements(
    info: ASTNodeInfo,
    body: List[SourceElement],
    strict: Boolean
) extends ASTNode {
  override def toString(indent: Int): String = ""
}
