import { SSMLElement } from '../core/SSMLElement';
import { ParagraphElement } from '../elements/ParagraphElement';
import { SentenceElement } from '../elements/SentenceElement';
import type { SayAsOptions, BreakOptions, PhonemeOptions, ProsodyOptions, EmphasisLevel } from '../types';

/**
 * Builder class for creating paragraph elements within an SSML document.
 * Provides a fluent API for structuring content into logical paragraph blocks with sentences and speech modifications.
 * 
 * Paragraphs help organize speech content and provide natural pauses between text blocks.
 * The `<p>` element is particularly useful for longer texts where you want to maintain
 * proper speech flow and intonation patterns.
 * 
 * @example
 * ```typescript
 * // Basic paragraph usage
 * voice.paragraph(p => p
 *   .text('This is the first sentence. ')
 *   .text('This is the second sentence.')
 * );
 * ```
 * 
 * @example
 * ```typescript
 * // Advanced paragraph with multiple elements
 * voice.paragraph(p => p
 *   .text('Welcome to our presentation. ')
 *   .sentence(s => s
 *     .text('This sentence has ')
 *     .emphasis('emphasis', 'strong')
 *   )
 *   .break('500ms')
 *   .sayAs('2025', { interpretAs: 'date' })
 * );
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#specify-paragraphs-and-sentences} Paragraph Element Documentation
 */
export class ParagraphBuilder extends SSMLElement {
  /** Internal ParagraphElement that accumulates all content */
  private paragraph = new ParagraphElement();

  /**
   * Adds plain text content to the paragraph.
   * Special characters (&, <, >, ", ') are automatically escaped.
   * 
   * @param text - The text to add to the paragraph
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph.text('This is a simple paragraph text. ');
   * 
   * // Chain multiple text segments
   * paragraph
   *   .text('First part. ')
   *   .text('Second part. ')
   *   .text('Third part.');
   * ```
   */
  text(text: string): this {
    this.paragraph.text(text);
    return this;
  }

  /**
   * Adds a sentence element to the paragraph with structured content.
   * Sentences help define clear boundaries for intonation and natural pauses.
   * 
   * The `<s>` element explicitly marks sentence boundaries, which can improve
   * the naturalness of speech synthesis by ensuring proper intonation patterns.
   * 
   * @param callback - Function that receives a SentenceElement to build sentence content
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Simple sentence
   * paragraph.sentence(s => s
   *   .text('This is a complete sentence.')
   * );
   * 
   * // Sentence with multiple elements
   * paragraph.sentence(s => s
   *   .text('The price is ')
   *   .sayAs('42.50', { interpretAs: 'currency', detail: 'USD' })
   *   .text(' including tax.')
   * );
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#specify-paragraphs-and-sentences} Sentence Element Documentation
   */
  sentence(callback: (sentenceElement: SentenceElement) => void): this {
    const sentenceElement = new SentenceElement();
    callback(sentenceElement);
    this.paragraph.addElement(sentenceElement);
    return this;
  }

  /**
   * Controls how text is interpreted and pronounced within the paragraph.
   * Useful for dates, numbers, currency, abbreviations, and other specialized text.
   * 
   * This method forwards to the underlying ParagraphElement's sayAs method,
   * allowing proper pronunciation of special text formats.
   * 
   * @param text - Text to interpret
   * @param options - Say-as configuration options
   * @param options.interpretAs - How to interpret the text (e.g., 'date', 'cardinal', 'currency', 'telephone')
   * @param options.format - Format specification (depends on interpretAs value)
   * @param options.detail - Additional detail for interpretation
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('The meeting is on ')
   *   .sayAs('2025-08-24', { 
   *     interpretAs: 'date', 
   *     format: 'ymd' 
   *   })
   *   .text(' at ')
   *   .sayAs('14:30', { 
   *     interpretAs: 'time',
   *     format: 'hms24'
   *   });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#say-as-element} Say-As Element Documentation
   */
  sayAs(text: string, options: SayAsOptions): this {
    this.paragraph.sayAs(text, options);
    return this;
  }

  /**
   * Substitutes text with an alias for pronunciation within the paragraph.
   * Useful for acronyms, abbreviations, or text that should be pronounced differently than written.
   * 
   * @param original - The original text as written
   * @param alias - How the text should be pronounced
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('The ')
   *   .sub('WHO', 'World Health Organization')
   *   .text(' released new guidelines.')
   *   .sub('Dr.', 'Doctor')
   *   .text(' Smith will present them.');
   * ```
   * 
   * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.11} Sub Element W3C Specification
   */
  sub(original: string, alias: string): this {
    this.paragraph.sub(original, alias);
    return this;
  }

  /**
   * Adds emphasized speech with adjustable intensity to the paragraph.
   * Changes the speaking style to emphasize certain words or phrases.
   * 
   * @param text - Text to emphasize
   * @param level - Emphasis level: 'strong' | 'moderate' | 'reduced'. Default is 'moderate'
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('This is ')
   *   .emphasis('extremely important', 'strong')
   *   .text(' for everyone to understand.')
   *   .emphasis('Please pay attention', 'moderate');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-emphasis} Emphasis Element Documentation
   */
  emphasis(text: string, level?: EmphasisLevel): this {
    this.paragraph.emphasis(text, level);
    return this;
  }

  /**
   * Adds a pause or break within the paragraph.
   * Can specify either duration or strength of the pause.
   * 
   * Breaks are useful for adding natural pauses between phrases or ideas,
   * improving the comprehension and naturalness of synthesized speech.
   * 
   * @param options - Break configuration or duration string
   * @param options.strength - Pause strength: 'x-weak' (250ms), 'weak' (500ms), 'medium' (750ms), 'strong' (1000ms), 'x-strong' (1250ms)
   * @param options.time - Explicit duration (e.g., '500ms', '2s'). Range: 0-20000ms
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Using duration string
   * paragraph
   *   .text('First point')
   *   .break('1s')
   *   .text('Second point');
   * 
   * // Using strength
   * paragraph
   *   .text('Let me think')
   *   .break({ strength: 'medium' })
   *   .text('Yes, I remember now');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-a-break} Break Element Documentation
   */
  break(options?: BreakOptions | string): this {
    this.paragraph.break(options);
    return this;
  }

  /**
   * Specifies exact phonetic pronunciation for text within the paragraph.
   * Provides precise control over how specific words are pronounced.
   * 
   * This is particularly useful for proper names, technical terms, or words
   * that the speech synthesizer might pronounce incorrectly by default.
   * 
   * @param text - Text to pronounce
   * @param options - Phoneme configuration
   * @param options.alphabet - Phonetic alphabet to use: 'ipa' | 'sapi' | 'ups'
   * @param options.ph - Phonetic transcription in the specified alphabet
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Using IPA (International Phonetic Alphabet)
   * paragraph
   *   .text('The word ')
   *   .phoneme('schedule', {
   *     alphabet: 'ipa',
   *     ph: 'ˈʃɛdjuːl'  // British pronunciation
   *   })
   *   .text(' has different pronunciations.');
   * 
   * // Using SAPI
   * paragraph.phoneme('Azure', {
   *   alphabet: 'sapi',
   *   ph: 'ae zh er'
   * });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#use-phonemes-to-improve-pronunciation} Phoneme Element Documentation
   */
  phoneme(text: string, options: PhonemeOptions): this {
    this.paragraph.phoneme(text, options);
    return this;
  }

  /**
   * Modifies prosody (pitch, rate, volume) of speech within the paragraph.
   * Allows fine-grained control over how text is spoken.
   * 
   * Prosody modifications can make speech sound more natural and expressive,
   * and can be used to convey emotion or emphasis.
   * 
   * @param text - Text to modify
   * @param options - Prosody configuration options
   * @param options.pitch - Pitch adjustment: '+10Hz', '-2st', 'x-low', 'low', 'medium', 'high', 'x-high', '+10%'
   * @param options.rate - Speaking rate: 'x-slow', 'slow', 'medium', 'fast', 'x-fast', '0.5', '2.0', '+10%'
   * @param options.volume - Volume level: 'silent', 'x-soft', 'soft', 'medium', 'loud', 'x-loud', '+10dB', '50%'
   * @param options.contour - Pitch contour changes over time
   * @param options.range - Pitch range variation
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Whispered effect
   * paragraph.prosody('This is a secret', {
   *   volume: 'x-soft',
   *   rate: 'slow',
   *   pitch: 'low'
   * });
   * 
   * // Excited speech
   * paragraph.prosody('Amazing news!', {
   *   rate: 'fast',
   *   pitch: 'high',
   *   volume: 'loud'
   * });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-prosody} Prosody Element Documentation
   */
  prosody(text: string, options: ProsodyOptions): this {
    this.paragraph.prosody(text, options);
    return this;
  }

  /**
   * Inserts an audio file within the paragraph.
   * Supports fallback text if the audio file is unavailable.
   * 
   * Audio elements can be used to include pre-recorded sounds, music,
   * or other audio content within the synthesized speech.
   * 
   * @param src - URL of the audio file (must be publicly accessible HTTPS URL)
   * @param fallbackText - Optional text to speak if audio fails to load
   * @returns This ParagraphBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * paragraph
   *   .text('And now, a word from our sponsor')
   *   .break('500ms')
   *   .audio(
   *     'https://example.com/jingle.mp3',
   *     'Sponsor message here'
   *   )
   *   .text('Back to our content.');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-recorded-audio} Audio Element Documentation
   */
  audio(src: string, fallbackText?: string): this {
    this.paragraph.audio(src, fallbackText);
    return this;
  }

  /**
   * Renders the paragraph element as an XML string.
   * This method is called internally by the SSML builder to generate the final XML.
   * 
   * @returns The paragraph element as an XML string with all its content
   * @internal
   * 
   * @example
   * ```typescript
   * const xml = paragraphBuilder.render();
   * // Returns: <p>paragraph content here</p>
   * ```
   */
  render(): string {
    return this.paragraph.render();
  }
}
