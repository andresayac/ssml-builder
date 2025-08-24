/**
 * Abstract base class for all SSML elements in the library.
 * 
 * This class provides the foundation for all SSML elements (voice, paragraph, sentence, etc.)
 * by defining the common interface and functionality that all elements must implement.
 * It serves as the contract that ensures all elements can be rendered to valid SSML XML
 * and handles the proper escaping of special XML characters.
 * 
 * All SSML element classes must extend this base class and implement the abstract
 * `render()` method to generate their specific XML representation.
 * 
 * @abstract
 * 
 * @example
 * ```typescript
 * // Example of a custom element extending SSMLElement
 * class CustomElement extends SSMLElement {
 *   private content: string;
 *   
 *   constructor(content: string) {
 *     super();
 *     this.content = content;
 *   }
 *   
 *   render(): string {
 *     // Use escapeXml to ensure valid XML
 *     return `<custom>${this.escapeXml(this.content)}</custom>`;
 *   }
 * }
 * ```
 * 
 * @see {@link https://www.w3.org/TR/speech-synthesis11/} W3C SSML Specification
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation
 */
export abstract class SSMLElement {
  /**
   * Renders the element as a valid SSML XML string.
   * 
   * This abstract method must be implemented by all concrete SSML element classes.
   * The implementation should generate the appropriate XML representation of the element,
   * including its opening and closing tags, attributes, and properly escaped content.
   * 
   * The rendered output must be valid according to the SSML 1.0 specification
   * and compatible with Azure Speech Service requirements.
   * 
   * @returns A string containing the XML representation of the SSML element
   * 
   * @abstract
   * 
   * @example
   * ```typescript
   * // Implementation in VoiceElement
   * class VoiceElement extends SSMLElement {
   *   render(): string {
   *     return `<voice name="en-US-AvaNeural">${content}</voice>`;
   *   }
   * }
   * 
   * // Implementation in BreakElement
   * class BreakElement extends SSMLElement {
   *   render(): string {
   *     return `<break time="500ms"/>`;
   *   }
   * }
   * 
   * // Implementation in EmphasisElement
   * class EmphasisElement extends SSMLElement {
   *   render(): string {
   *     return `<emphasis level="strong">${this.escapeXml(text)}</emphasis>`;
   *   }
   * }
   * ```
   */
  abstract render(): string;
  
  /**
   * Escapes special XML characters in text content to ensure valid XML output.
   * 
   * This method replaces XML special characters with their corresponding entity references
   * to prevent XML parsing errors and potential security issues (XML injection).
   * It should be used whenever inserting user-provided or dynamic text content into XML elements.
   * 
   * The following characters are escaped:
   * - `&` becomes `&amp;` (must be escaped first to avoid double-escaping)
   * - `<` becomes `&lt;` (prevents opening of unintended tags)
   * - `>` becomes `&gt;` (prevents closing of unintended tags)
   * - `"` becomes `&quot;` (prevents breaking out of attribute values)
   * - `'` becomes `&apos;` (prevents breaking out of attribute values)
   * 
   * This method is marked as `protected` so it's only accessible to classes that extend
   * SSMLElement, ensuring proper encapsulation while allowing all element implementations
   * to use this essential functionality.
   * 
   * @param text - The text content to escape
   * @returns The text with all special XML characters properly escaped
   * 
   * @protected
   * 
   * @example
   * ```typescript
   * // In a render method implementation
   * class TextElement extends SSMLElement {
   *   private text: string = 'Hello & "world" <script>';
   *   
   *   render(): string {
   *     // Escapes to: Hello &amp; &quot;world&quot; &lt;script&gt;
   *     return `<text>${this.escapeXml(this.text)}</text>`;
   *   }
   * }
   * 
   * // Edge cases handled correctly
   * this.escapeXml('5 < 10 & 10 > 5');  
   * // Returns: '5 &lt; 10 &amp; 10 &gt; 5'
   * 
   * this.escapeXml('She said "Hello"');  
   * // Returns: 'She said &quot;Hello&quot;'
   * 
   * this.escapeXml("It's a test");       
   * // Returns: 'It&apos;s a test'
   * 
   * // Prevents XML injection
   * this.escapeXml('</voice><voice name="evil">');  
   * // Returns: '&lt;/voice&gt;&lt;voice name=&quot;evil&quot;&gt;'
   * ```
   * 
   * @see {@link https://www.w3.org/TR/xml/#syntax} XML 1.0 Specification - Character Data and Markup
   * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html} OWASP XML Security
   */
  protected escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')   // Must be first to avoid double-escaping
      .replace(/</g, '&lt;')     // Less than
      .replace(/>/g, '&gt;')     // Greater than  
      .replace(/"/g, '&quot;')   // Double quote
      .replace(/'/g, '&apos;');  // Single quote/apostrophe
  }
}
