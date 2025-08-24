import { SSMLElement } from '../core/SSMLElement';

/**
 * SSML element for explicitly marking sentence boundaries in speech synthesis.
 * 
 * The `<s>` element denotes a sentence within the synthesized speech output. While the
 * speech synthesizer automatically detects sentence boundaries based on punctuation and
 * context, the sentence element allows for explicit control over sentence structure.
 * This is particularly useful when automatic detection might be incorrect or when you
 * need precise control over intonation patterns and pauses between sentences.
 * 
 * Sentences help the synthesizer apply appropriate prosody, including natural intonation
 * patterns for statements, questions, and exclamations. They also ensure proper pauses
 * between sentences for better comprehension.
 * 
 * @example
 * ```typescript
 * // Simple sentence
 * const sentence = new SentenceElement();
 * sentence.text('This is a complete sentence.');
 * sentence.render();
 * // Output: <s>This is a complete sentence.</s>
 * 
 * // Sentence with multiple elements
 * const complex = new SentenceElement();
 * complex
 *   .text('The price is ')
 *   .addElement(new SayAsElement('42.50', { interpretAs: 'currency', detail: 'USD' }));
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .paragraph(p => p
 *       .sentence(s => s.text('First sentence.'))
 *       .sentence(s => s.text('Second sentence.'))
 *     )
 *   .build();
 * ```
 * 
 * @remarks
 * - The s element can contain text and the following elements: audio, break, phoneme, prosody, say-as, mstts:express-as, and sub [[11]]
 * - Sentences are typically used within paragraph elements but can appear directly in voice elements
 * - The synthesizer adds appropriate pauses after sentences automatically
 * - Sentence boundaries affect intonation patterns, especially for questions
 * - Special XML characters in text are automatically escaped
 * - If sentences are not explicitly marked, the service automatically determines structure [[11]]
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#specify-paragraphs-and-sentences} Paragraph and Sentence Documentation [[11]]
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.8} W3C SSML Sentence Specification
 */
export class SentenceElement extends SSMLElement {
  /**
   * Collection of content elements (text or other SSML elements) within the sentence.
   * @private
   */
  private content: (string | SSMLElement)[] = [];

  /**
   * Adds plain text content to the sentence.
   * 
   * The text will be spoken as part of the sentence with appropriate intonation
   * and prosody for sentence context. Special XML characters are automatically
   * escaped to ensure valid XML output and prevent injection attacks.
   * 
   * @param text - The text content to add to the sentence.
   *               Will be spoken with sentence-appropriate prosody and intonation.
   *               Multiple calls append text sequentially within the same sentence.
   * @returns This SentenceElement instance for method chaining
   * 
   * @example
   * ```typescript
   * const sentence = new SentenceElement();
   * sentence.text('This is the beginning ');
   * sentence.text('and this is the end.');
   * // Result: <s>This is the beginning and this is the end.</s>
   * 
   * // With special characters (automatically escaped)
   * sentence.text('She said "Hello" & goodbye.');
   * // Result: <s>She said &quot;Hello&quot; &amp; goodbye.</s>
   * 
   * // Building a question
   * const question = new SentenceElement();
   * question.text('Are you coming to the meeting?');
   * // The synthesizer will apply rising intonation for the question
   * ```
   */
  text(text: string): this {
    this.content.push(text);
    return this;
  }

  /**
   * Adds an SSML element as a child of this sentence.
   * 
   * This method allows adding valid SSML elements that can be contained within
   * a sentence according to the SSML specification. This enables complex sentence
   * structures with various speech modifications while maintaining sentence boundaries.
   * 
   * @param element - An SSML element to add to the sentence.
   *                  Must be one of the allowed child elements for sentences:
   *                  audio, break, phoneme, prosody, say-as, mstts:express-as, or sub [[11]].
   * @returns This SentenceElement instance for method chaining
   * 
   * @example
   * ```typescript
   * const sentence = new SentenceElement();
   * 
   * // Add emphasis element
   * const emphasis = new EmphasisElement('important', 'strong');
   * sentence
   *   .text('This is ')
   *   .addElement(emphasis)
   *   .text(' information.');
   * 
   * // Add break element
   * const pause = new BreakElement({ time: '500ms' });
   * sentence
   *   .text('Wait for it')
   *   .addElement(pause)
   *   .text('here it comes!');
   * 
   * // Add say-as element for proper pronunciation
   * const date = new SayAsElement('2025-12-31', { 
   *   interpretAs: 'date', 
   *   format: 'ymd' 
   * });
   * sentence
   *   .text('The deadline is ')
   *   .addElement(date)
   *   .text('.');
   * 
   * // Complex sentence with multiple elements
   * const phoneme = new PhonemeElement('Azure', { 
   *   alphabet: 'ipa', 
   *   ph: 'æʒər' 
   * });
   * sentence
   *   .text('We use ')
   *   .addElement(phoneme)
   *   .text(' for cloud services.');
   * ```
   */
  addElement(element: SSMLElement): this {
    this.content.push(element);
    return this;
  }

  /**
   * Renders the sentence element as an SSML XML string.
   * 
   * Generates the `<s>` element containing all child content. Text content is
   * automatically escaped to prevent XML injection, while child elements are
   * rendered recursively to build the complete sentence structure. The rendered
   * sentence will be processed by the speech synthesizer with appropriate
   * intonation patterns and timing for sentence boundaries.
   * 
   * @returns The XML string representation of the sentence element in the format:
   *          `<s>content</s>` where content can be text and/or child elements
   * 
   * @example
   * ```typescript
   * // Simple text sentence
   * const simple = new SentenceElement();
   * simple.text('This is a sentence.');
   * console.log(simple.render());
   * // Output: <s>This is a sentence.</s>
   * 
   * // Sentence with mixed content
   * const mixed = new SentenceElement();
   * mixed
   *   .text('The price is ')
   *   .addElement(new SayAsElement('42.50', { 
   *     interpretAs: 'currency', 
   *     detail: 'USD' 
   *   }));
   * console.log(mixed.render());
   * // Output: <s>The price is <say-as interpret-as="currency" detail="USD">42.50</say-as></s>
   * 
   * // Multiple text segments
   * const multi = new SentenceElement();
   * multi.text('First part ').text('second part ').text('final part.');
   * console.log(multi.render());
   * // Output: <s>First part second part final part.</s>
   * 
   * // With escaped special characters
   * const special = new SentenceElement();
   * special.text('Terms & "conditions" apply.');
   * console.log(special.render());
   * // Output: <s>Terms &amp; &quot;conditions&quot; apply.</s>
   * ```
   * 
   * @override
   */
  render(): string {
    const contentStr = this.content.map(c => 
      typeof c === 'string' ? this.escapeXml(c) : c.render()
    ).join('');
    
    return `<s>${contentStr}</s>`;
  }
}
