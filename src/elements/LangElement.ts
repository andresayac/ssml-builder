import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for specifying language changes within speech content.
 * 
 * The `<lang>` element allows you to switch languages or locales within the synthesized speech.
 * This is essential for multilingual content, proper pronunciation of foreign words, or when
 * you need to include phrases from different languages within the same voice output.
 * The element ensures that text is pronounced according to the rules of the specified language.
 * 
 * The lang element can be nested within voice, paragraph, sentence, and most other container
 * elements. It inherits the voice characteristics but applies language-specific pronunciation
 * rules to its content.
 * 
 * @example
 * ```typescript
 * // Simple language switch
 * const spanish = new LangElement('es-ES');
 * spanish.text('Hola amigo');
 * spanish.render();
 * // Output: <lang xml:lang="es-ES">Hola amigo</lang>
 * 
 * // Use with SSMLBuilder for multilingual content
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaMultilingualNeural')
 *     .text('Hello! ')
 *     .lang('es-ES', lang => lang.text('¡Hola! '))
 *     .lang('fr-FR', lang => lang.text('Bonjour!'))
 *   .build();
 * ```
 * 
 * @remarks
 * - The lang element can contain all other elements except mstts:backgroundaudio, voice, and speak [[11]]
 * - Use multilingual neural voices for best results when switching languages
 * - The language code should be a valid BCP-47 language tag (e.g., 'en-US', 'es-ES', 'fr-FR')
 * - Language switching works best with voices that support multiple languages
 * - Special XML characters in text content are automatically escaped
 * - Can be nested within other lang elements for complex multilingual scenarios
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#use-multiple-languages} Multiple Languages Documentation
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.12} W3C SSML Lang Element Specification
 */
export class LangElement extends SSMLElement {
  /**
   * Collection of content elements (text or other SSML elements).
   * @private
   */
  private content: (string | SSMLElement)[] = [];
  
  /**
   * The language/locale code for this element's content.
   * @private
   */
  private lang: string;

  /**
   * Creates a new LangElement instance.
   * 
   * @param lang - The language or locale code for the content within this element.
   *               Must be a valid BCP-47 language tag format.
   *               Common formats:
   *               - Language only: 'en', 'es', 'fr', 'de', 'zh'
   *               - Language-Region: 'en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'zh-CN'
   *               The language code determines pronunciation rules and voice characteristics.
   * 
   * @example
   * ```typescript
   * // Spanish language
   * const spanish = new LangElement('es-ES');
   * 
   * // French language
   * const french = new LangElement('fr-FR');
   * 
   * // British English
   * const british = new LangElement('en-GB');
   * 
   * // Simplified Chinese
   * const chinese = new LangElement('zh-CN');
   * 
   * // German
   * const german = new LangElement('de-DE');
   * ```
   */
  constructor(lang: string) {
    super();
    this.lang = lang;
  }

  /**
   * Adds plain text content to the language element.
   * 
   * The text will be spoken using the pronunciation rules of the specified language.
   * Special XML characters (&, <, >, ", ') are automatically escaped to ensure
   * valid XML output and prevent injection attacks.
   * 
   * @param text - The text content to add in the specified language.
   *               Will be pronounced according to the language's phonetic rules.
   * @returns This LangElement instance for method chaining
   * 
   * @example
   * ```typescript
   * // Single text segment
   * const lang = new LangElement('es-ES');
   * lang.text('Buenos días');
   * 
   * // Multiple text segments
   * const multilang = new LangElement('fr-FR');
   * multilang
   *   .text('Bonjour, ')
   *   .text('comment allez-vous?');
   * 
   * // With special characters (automatically escaped)
   * const special = new LangElement('de-DE');
   * special.text('Müller & Schmidt GmbH');
   * ```
   */
  text(text: string): this {
    this.content.push(text);
    return this;
  }

  /**
   * Adds an SSML element as a child of this language element.
   * 
   * This allows for complex nested structures where other SSML elements
   * (like emphasis, prosody, break, etc.) can be used within the language context.
   * The child element inherits the language setting of this lang element.
   * 
   * @param element - An SSML element to add as a child.
   *                  Can be any SSML element except speak, voice, or mstts:backgroundaudio [[11]].
   * @returns This LangElement instance for method chaining
   * 
   * @example
   * ```typescript
   * // Add emphasis within language context
   * const lang = new LangElement('es-ES');
   * const emphasis = new EmphasisElement('importante', 'strong');
   * lang
   *   .text('Esto es ')
   *   .addElement(emphasis);
   * 
   * // Add break within language
   * const french = new LangElement('fr-FR');
   * const pause = new BreakElement({ time: '500ms' });
   * french
   *   .text('Bonjour')
   *   .addElement(pause)
   *   .text('mes amis');
   * 
   * // Complex nested structure
   * const german = new LangElement('de-DE');
   * const prosody = new ProsodyElement('langsam', { rate: 'slow' });
   * german
   *   .text('Sprechen Sie ')
   *   .addElement(prosody)
   *   .text(' bitte');
   * ```
   */
  addElement(element: SSMLElement): this {
    this.content.push(element);
    return this;
  }

  /**
   * Renders the language element as an SSML XML string.
   * 
   * Generates the `<lang>` element with the xml:lang attribute specifying the language.
   * All content (text and child elements) is rendered within the lang tags.
   * Text content is automatically escaped to prevent XML injection and ensure valid output.
   * 
   * @returns The XML string representation of the language element in the format:
   *          `<lang xml:lang="language-code">content</lang>`
   * 
   * @example
   * ```typescript
   * // Simple text content
   * const lang1 = new LangElement('es-ES');
   * lang1.text('Hola mundo');
   * console.log(lang1.render());
   * // Output: <lang xml:lang="es-ES">Hola mundo</lang>
   * 
   * // Mixed content with elements
   * const lang2 = new LangElement('fr-FR');
   * lang2
   *   .text('Ceci est ')
   *   .addElement(new EmphasisElement('important', 'strong'));
   * console.log(lang2.render());
   * // Output: <lang xml:lang="fr-FR">Ceci est <emphasis level="strong">important</emphasis></lang>
   * 
   * // Multiple text segments
   * const lang3 = new LangElement('de-DE');
   * lang3.text('Guten ').text('Tag');
   * console.log(lang3.render());
   * // Output: <lang xml:lang="de-DE">Guten Tag</lang>
   * 
   * // With escaped special characters
   * const lang4 = new LangElement('en-GB');
   * lang4.text('Fish & chips');
   * console.log(lang4.render());
   * // Output: <lang xml:lang="en-GB">Fish &amp; chips</lang>
   * ```
   * 
   * @override
   */
  render(): string {
    const contentStr = this.content.map(c => 
      typeof c === 'string' ? this.escapeXml(c) : c.render()
    ).join('');
    
    return `<lang xml:lang="${this.lang}">${contentStr}</lang>`;
  }
}
