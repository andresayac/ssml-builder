import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for embedding mathematical expressions using MathML.
 * 
 * The `<math>` element allows you to include Mathematical Markup Language (MathML) content
 * within SSML documents. This enables text-to-speech engines to correctly pronounce
 * mathematical formulas, equations, and expressions. The speech synthesizer interprets
 * the MathML markup and converts it to natural spoken mathematics, handling complex
 * notation like fractions, superscripts, roots, and mathematical symbols appropriately.
 * 
 * MathML is an XML-based language specifically designed for describing mathematical notation
 * and capturing both its structure and content. When embedded in SSML, it ensures that
 * mathematical content is spoken clearly and accurately, making it essential for educational
 * content, scientific applications, and any scenario involving mathematical expressions.
 * 
 * @example
 * ```typescript
 * // Simple mathematical expression
 * const math = new MathElement('<mrow><mi>x</mi><mo>+</mo><mn>2</mn></mrow>');
 * math.render();
 * // Output: <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>x</mi><mo>+</mo><mn>2</mn></mrow></math>
 * 
 * // Quadratic formula
 * const quadratic = new MathElement(`
 *   <mrow>
 *     <mi>x</mi>
 *     <mo>=</mo>
 *     <mfrac>
 *       <mrow>
 *         <mo>-</mo><mi>b</mi><mo>±</mo>
 *         <msqrt>
 *           <mrow>
 *             <msup><mi>b</mi><mn>2</mn></msup>
 *             <mo>-</mo>
 *             <mn>4</mn><mi>a</mi><mi>c</mi>
 *           </mrow>
 *         </msqrt>
 *       </mrow>
 *       <mrow><mn>2</mn><mi>a</mi></mrow>
 *     </mfrac>
 *   </mrow>
 * `);
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('The equation is: ')
 *     .math('<mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow>')
 *   .build();
 * ```
 * 
 * @remarks
 * - The math element can only contain text and MathML elements
 * - Not all TTS engines fully support MathML - check service documentation
 * - The MathML namespace is automatically added to the math element
 * - Complex mathematical expressions may be simplified in speech output
 * - Consider providing alternative text descriptions for accessibility
 * - MathML content should be well-formed XML
 * - Some services may have limitations on MathML complexity
 * 
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.9} W3C SSML Math Element Specification
 * @see {@link https://www.w3.org/Math/} W3C MathML Homepage
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/MathML} MDN MathML Documentation
 */
export class MathElement extends SSMLElement {
  /**
   * The MathML content as a string.
   * @private
   */
  private mathML: string;

  /**
   * Creates a new MathElement instance.
   * 
   * @param mathML - The MathML markup as a string.
   *                 Should contain valid MathML elements that describe the mathematical expression.
   *                 The content will be wrapped in a math element with the MathML namespace.
   *                 Common MathML elements include:
   *                 - `<mi>`: Identifier (variables like x, y)
   *                 - `<mn>`: Number
   *                 - `<mo>`: Operator (+, -, =, etc.)
   *                 - `<mrow>`: Group of elements
   *                 - `<mfrac>`: Fraction
   *                 - `<msqrt>`: Square root
   *                 - `<msup>`: Superscript (powers)
   *                 - `<msub>`: Subscript
   *                 - `<mroot>`: Root with index
   * 
   * @example
   * ```typescript
   * // Simple addition
   * const addition = new MathElement(
   *   '<mrow><mn>2</mn><mo>+</mo><mn>2</mn></mrow>'
   * );
   * 
   * // Variable expression
   * const variable = new MathElement(
   *   '<mrow><mi>y</mi><mo>=</mo><mi>m</mi><mi>x</mi><mo>+</mo><mi>b</mi></mrow>'
   * );
   * 
   * // Fraction
   * const fraction = new MathElement(
   *   '<mfrac><mn>1</mn><mn>2</mn></mfrac>'
   * );
   * 
   * // Square root
   * const sqrt = new MathElement(
   *   '<msqrt><mn>16</mn></msqrt>'
   * );
   * 
   * // Power/exponent
   * const power = new MathElement(
   *   '<msup><mi>x</mi><mn>2</mn></msup>'
   * );
   * 
   * // Complex formula (Pythagorean theorem)
   * const pythagorean = new MathElement(`
   *   <mrow>
   *     <msup><mi>a</mi><mn>2</mn></msup>
   *     <mo>+</mo>
   *     <msup><mi>b</mi><mn>2</mn></msup>
   *     <mo>=</mo>
   *     <msup><mi>c</mi><mn>2</mn></msup>
   *   </mrow>
   * `);
   * 
   * // Integral
   * const integral = new MathElement(`
   *   <mrow>
   *     <msubsup>
   *       <mo>∫</mo>
   *       <mn>0</mn>
   *       <mi>∞</mi>
   *     </msubsup>
   *     <mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo>
   *     <mi>d</mi><mi>x</mi>
   *   </mrow>
   * `);
   * ```
   */
  constructor(mathML: string) {
    super();
    this.mathML = mathML;
  }

  /**
   * Renders the math element as an SSML XML string.
   * 
   * Generates the `<math>` element with the MathML namespace and the provided
   * MathML content. The namespace attribute is required for proper interpretation
   * of the mathematical markup. The MathML content is inserted directly without
   * escaping as it should already be valid XML markup.
   * 
   * @returns The XML string representation of the math element in the format:
   *          `<math xmlns="http://www.w3.org/1998/Math/MathML">mathML content</math>`
   * 
   * @example
   * ```typescript
   * // Simple expression
   * const math1 = new MathElement('<mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow>');
   * console.log(math1.render());
   * // Output: <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></math>
   * 
   * // Fraction
   * const math2 = new MathElement('<mfrac><mn>3</mn><mn>4</mn></mfrac>');
   * console.log(math2.render());
   * // Output: <math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>3</mn><mn>4</mn></mfrac></math>
   * 
   * // Complex expression with multiple elements
   * const math3 = new MathElement(`
   *   <mrow>
   *     <mi>E</mi>
   *     <mo>=</mo>
   *     <mi>m</mi>
   *     <msup>
   *       <mi>c</mi>
   *       <mn>2</mn>
   *     </msup>
   *   </mrow>
   * `);
   * console.log(math3.render());
   * // Output: <math xmlns="http://www.w3.org/1998/Math/MathML">
   * //   <mrow>
   * //     <mi>E</mi>
   * //     <mo>=</mo>
   * //     <mi>m</mi>
   * //     <msup>
   * //       <mi>c</mi>
   * //       <mn>2</mn>
   * //     </msup>
   * //   </mrow>
   * // </math>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<math xmlns="http://www.w3.org/1998/Math/MathML">${this.mathML}</math>`;
  }
}
