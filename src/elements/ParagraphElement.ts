import { SSMLElement } from '../core/SSMLElement';
import { SayAsElement } from './SayAsElement';
import { SubElement } from './SubElement';
import { EmphasisElement } from './EmphasisElement';
import { BreakElement } from './BreakElement';
import { PhonemeElement } from './PhonemeElement';
import { ProsodyElement } from './ProsodyElement';
import { AudioElement } from './AudioElement';
import type { SayAsOptions, BreakOptions, PhonemeOptions, ProsodyOptions, EmphasisLevel } from '../types';

/**
 * SSML element for structuring content into paragraphs.
 * 
 * The `<p>` element denotes a paragraph in synthesized speech, providing logical structure
 * to the content and ensuring appropriate pauses between blocks of text. The speech synthesizer
 * uses paragraph boundaries to apply natural intonation patterns and timing, creating more
 * comprehensible and natural-sounding speech output. This element is particularly useful
 * for longer texts where clear separation of ideas improves listener comprehension.
 * 
 * Paragraphs can contain various inline elements including text, sentences, breaks, emphasis,
 * prosody, and other speech modification elements. The paragraph element helps the synthesizer
 * understand document structure even when sentence elements aren't explicitly marked.
 * 
 * @example
 * ```typescript
 * // Simple paragraph with text
 * const paragraph = new ParagraphElement();
 * paragraph.text('This is a complete paragraph.');
 * paragraph.render();
 * // Output: <p>This is a complete paragraph.</p>
 * 
 * // Paragraph with multiple elements
 * const complex = new ParagraphElement();
 * complex
 *   .text('Important: ')
 *   .emphasis('Read carefully', 'strong')
 *   .text(' before proceeding.');
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .paragraph(p => p
 *       .text('First paragraph content.')
 *     )
 *     .paragraph(p => p
 *       .text('Second paragraph content.')
 *     )
 *   .build();
 * ```
 * 
 * @remarks
 * - Paragraphs automatically add appropriate pauses before and after their content [[11]]
 * - Can contain text and the following elements: audio, break, phoneme, prosody, say-as, sub, mstts:express-as, and s [[11]]
 * - Paragraph boundaries help with natural speech flow and intonation
 * - Nested paragraphs are not allowed
 * - Special XML characters in text are automatically escaped
 * - If paragraphs are not explicitly marked, the service automatically determines structure
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#specify-paragraphs-and-sentences} Paragraph and Sentence Documentation [[11]]
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.8} W3C SSML Paragraph Specification
 */
export class ParagraphElement extends SSMLElement {
  /**
   * Collection of content elements (text or other SSML elements) within the paragraph.
   * @private
   */
  private content: (string | SSMLElement)[] = [];

  /**
   * Adds plain text content to the paragraph.
   * 
   * The text will be spoken as part of the paragraph with appropriate pauses
   * and intonation for paragraph context. Special XML characters are automatically
   * escaped to ensure valid XML output and prevent injection attacks.
   * 
   * @param text - The text content to add to the paragraph.
   *               Will be spoken with paragraph-appropriate prosody.
   *               Multiple calls append text sequentially.
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * const paragraph = new ParagraphElement();
   * paragraph.text('This is the first sentence. ');
   * paragraph.text('This is the second sentence.');
   * // Result: <p>This is the first sentence. This is the second sentence.</p>
   * 
   * // With special characters (automatically escaped)
   * paragraph.text('Terms & conditions apply.');
   * ```
   */
  text(text: string): this {
    this.content.push(text);
    return this;
  }

  /**
   * Adds an SSML element as a child of this paragraph.
   * 
   * This method allows adding any valid SSML element that can be contained
   * within a paragraph, enabling complex structured content with various
   * speech modifications and effects.
   * 
   * @param element - An SSML element to add to the paragraph.
   *                  Must be a valid child element for paragraphs.
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * const paragraph = new ParagraphElement();
   * const sentence = new SentenceElement();
   * sentence.text('This is a sentence.');
   * paragraph.addElement(sentence);
   * 
   * // Add multiple elements
   * const emphasis = new EmphasisElement('important', 'strong');
   * paragraph
   *   .text('This is ')
   *   .addElement(emphasis)
   *   .text(' information.');
   * ```
   */
  addElement(element: SSMLElement): this {
    this.content.push(element);
    return this;
  }

  /**
   * Adds a say-as element to control pronunciation of formatted text.
   * 
   * The say-as element ensures proper pronunciation of dates, numbers,
   * currency, and other specialized text formats within the paragraph.
   * 
   * @param text - The text to be interpreted
   * @param options - Configuration for text interpretation
   * @param options.interpretAs - How to interpret the text (date, cardinal, currency, etc.)
   * @param options.format - Optional format hint for interpretation
   * @param options.detail - Optional additional detail (e.g., currency code)
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('The date is ')
   *   .sayAs('2025-12-31', { interpretAs: 'date', format: 'ymd' })
   *   .text(' and the amount is ')
   *   .sayAs('42.50', { interpretAs: 'currency', detail: 'USD' });
   * ```
   */
  sayAs(text: string, options: SayAsOptions): this {
    this.content.push(new SayAsElement(text, options));
    return this;
  }

  /**
   * Adds a substitution element for custom pronunciation.
   * 
   * The sub element allows you to specify an alias that should be spoken
   * instead of the written text, useful for acronyms or abbreviations.
   * 
   * @param original - The text as written
   * @param alias - How the text should be pronounced
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('The ')
   *   .sub('WHO', 'World Health Organization')
   *   .text(' recommends regular exercise.');
   * ```
   */
  sub(original: string, alias: string): this {
    this.content.push(new SubElement(original, alias));
    return this;
  }

  /**
   * Adds emphasized text to the paragraph.
   * 
   * Emphasis changes the speaking style to highlight important words or phrases
   * through changes in pitch, timing, and vocal stress.
   * 
   * @param text - The text to emphasize
   * @param level - Optional emphasis level: 'strong', 'moderate' (default), or 'reduced'
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('This is ')
   *   .emphasis('very important', 'strong')
   *   .text(' for everyone to know.');
   * ```
   */
  emphasis(text: string, level?: EmphasisLevel): this {
    this.content.push(new EmphasisElement(text, level));
    return this;
  }

  /**
   * Adds a pause or break within the paragraph.
   * 
   * Breaks provide control over pauses between words or sentences,
   * useful for improving comprehension or creating dramatic effect.
   * 
   * @param options - Break configuration or duration string.
   *                  Can be a duration (e.g., '500ms') or an object with strength/time.
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * // Simple duration
   * paragraph
   *   .text('First point')
   *   .break('1s')
   *   .text('Second point');
   * 
   * // With strength
   * paragraph
   *   .text('Let me think')
   *   .break({ strength: 'medium' })
   *   .text('Yes, I remember');
   * ```
   */
  break(options?: BreakOptions | string): this {
    if (typeof options === 'string') {
      this.content.push(new BreakElement({ time: options }));
    } else {
      this.content.push(new BreakElement(options));
    }
    return this;
  }

  /**
   * Adds phonetic pronunciation for specific text.
   * 
   * The phoneme element provides exact pronunciation using phonetic alphabets,
   * essential for proper names or technical terms that might be mispronounced.
   * 
   * @param text - The text to pronounce
   * @param options - Phoneme configuration
   * @param options.alphabet - Phonetic alphabet to use (ipa, sapi, or ups)
   * @param options.ph - Phonetic transcription
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('The company ')
   *   .phoneme('Xilinx', { alphabet: 'ipa', ph: 'zaɪlɪŋks' })
   *   .text(' makes semiconductors.');
   * ```
   */
  phoneme(text: string, options: PhonemeOptions): this {
    this.content.push(new PhonemeElement(text, options));
    return this;
  }

  /**
   * Adds text with modified prosody (pitch, rate, volume).
   * 
   * Prosody modifications affect how text is spoken, allowing for
   * expressive variations in speech characteristics.
   * 
   * @param text - The text to modify
   * @param options - Prosody configuration
   * @param options.pitch - Pitch adjustment
   * @param options.rate - Speaking rate
   * @param options.volume - Volume level
   * @param options.contour - Pitch contour over time
   * @param options.range - Pitch range variation
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('Normal speech, then ')
   *   .prosody('whispered text', { 
   *     volume: 'x-soft', 
   *     pitch: 'low' 
   *   })
   *   .text(' back to normal.');
   * ```
   */
  prosody(text: string, options: ProsodyOptions): this {
    this.content.push(new ProsodyElement(text, options));
    return this;
  }

  /**
   * Adds an audio file to the paragraph.
   * 
   * The audio element allows insertion of pre-recorded audio files
   * within the paragraph content, with optional fallback text.
   * 
   * @param src - URL of the audio file (must be HTTPS)
   * @param fallbackText - Optional text to speak if audio is unavailable
   * @returns This ParagraphElement instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('Listen to this sound: ')
   *   .audio('https://example.com/sound.mp3', 'Audio effect')
   *   .text(' Interesting, right?');
   * ```
   */
  audio(src: string, fallbackText?: string): this {
    this.content.push(new AudioElement(src, fallbackText));
    return this;
  }

  /**
   * Renders the paragraph element as an SSML XML string.
   * 
   * Generates the `<p>` element containing all child content. Text content
   * is automatically escaped to prevent XML injection, while child elements
   * are rendered recursively to build the complete paragraph structure.
   * 
   * @returns The XML string representation of the paragraph element
   * 
   * @example
   * ```typescript
   * const paragraph = new ParagraphElement();
   * paragraph
   *   .text('This is ')
   *   .emphasis('important', 'strong')
   *   .text('.');
   * console.log(paragraph.render());
   * // Output: <p>This is <emphasis level="strong">important</emphasis>.</p>
   * ```
   * 
   * @override
   */
  render(): string {
    const contentStr = this.content.map(c => 
      typeof c === 'string' ? this.escapeXml(c) : c.render()
    ).join('');
    
    return `<p>${contentStr}</p>`;
  }
}
