import { SSMLElement } from '../core/SSMLElement';
import { SentenceElement } from '../elements/SentenceElement';
import { BreakElement } from '../elements/BreakElement';
import { PhonemeElement } from '../elements/PhonemeElement';
import { ProsodyElement } from '../elements/ProsodyElement';
import { SayAsElement } from '../elements/SayAsElement';
import { SubElement } from '../elements/SubElement';
import { EmphasisElement } from '../elements/EmphasisElement';
import type { BreakOptions, PhonemeOptions, ProsodyOptions, SayAsOptions, EmphasisLevel } from '../types';

/**
 * Builder class for creating sentence elements within an SSML document.
 * Provides a fluent API for structuring content into grammatically complete sentences with proper intonation.
 * 
 * The `<s>` element explicitly marks sentence boundaries, which helps the speech synthesizer
 * apply appropriate intonation patterns, pauses, and prosody. This is particularly useful
 * when the default sentence detection might not work correctly for your specific content.
 * 
 * @example
 * ```typescript
 * // Basic sentence usage
 * voice.sentence(s => s
 *   .text('This is a complete sentence.')
 * );
 * ```
 * 
 * @example
 * ```typescript
 * // Complex sentence with multiple speech elements
 * voice.sentence(s => s
 *   .text('The meeting is on ')
 *   .sayAs('2025-08-24', { interpretAs: 'date' })
 *   .text(' at ')
 *   .sayAs('14:30', { interpretAs: 'time' })
 *   .break('200ms')
 *   .emphasis('Don\'t be late!', 'strong')
 * );
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#specify-paragraphs-and-sentences} Sentence Element Documentation
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.8} W3C Sentence Element Specification
 */
export class SentenceBuilder extends SSMLElement {
  /** Internal SentenceElement that accumulates all content */
  private sentence = new SentenceElement();

  /**
   * Adds plain text content to the sentence.
   * Special characters (&, <, >, ", ') are automatically escaped to ensure valid XML.
   * 
   * Multiple text segments can be added and will be concatenated in order.
   * The text will be spoken with the natural intonation for a sentence.
   * 
   * @param text - The text content to add to the sentence
   * @returns This SentenceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Simple text
   * sentence.text('This is a simple sentence.');
   * 
   * // Building a sentence with multiple text segments
   * sentence
   *   .text('The answer is ')
   *   .text('forty-two')
   *   .text('.');
   * 
   * // Text with special characters (automatically escaped)
   * sentence.text('She said "Hello & goodbye" to everyone.');
   * ```
   */
  text(text: string): this {
    this.sentence.text(text);
    return this;
  }

  /**
   * Adds a pause or break within the sentence.
   * Useful for creating natural pauses between clauses or for dramatic effect.
   * 
   * Breaks within sentences can help improve comprehension and create more
   * natural-sounding speech by adding pauses where commas or other punctuation
   * might naturally occur.
   * 
   * @param options - Break configuration or duration string
   * @param options.strength - Pause strength: 'x-weak' (250ms), 'weak' (500ms), 'medium' (750ms), 'strong' (1000ms), 'x-strong' (1250ms)
   * @param options.time - Explicit duration (e.g., '500ms', '2s'). Range: 0-20000ms. Overrides strength if both are specified.
   * @returns This SentenceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Using duration string for precise control
   * sentence
   *   .text('First')
   *   .break('300ms')
   *   .text('let me think about that.');
   * 
   * // Using strength for semantic pauses
   * sentence
   *   .text('Well')
   *   .break({ strength: 'weak' })
   *   .text('that\'s interesting.');
   * 
   * // Creating dramatic pause
   * sentence
   *   .text('The winner is')
   *   .break('2s')
   *   .text('Team Alpha!');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-a-break} Break Element Documentation
   */
  break(options?: BreakOptions | string): this {
    const breakElement = typeof options === 'string' 
      ? new BreakElement({ time: options })
      : new BreakElement(options);
    this.sentence.addElement(breakElement);
    return this;
  }

  /**
   * Adds emphasized speech with adjustable intensity to the sentence.
   * Emphasis changes the speaking style to highlight important words or phrases.
   * 
   * The emphasis level affects both the pitch and timing of the emphasized text,
   * making it stand out from the surrounding speech.
   * 
   * @param text - Text to emphasize
   * @param level - Emphasis level: 'strong' | 'moderate' | 'reduced'. Default is 'moderate'
   * @returns This SentenceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Strong emphasis for important information
   * sentence
   *   .text('This is ')
   *   .emphasis('absolutely critical', 'strong')
   *   .text(' for success.');
   * 
   * // Moderate emphasis (default)
   * sentence
   *   .text('Please ')
   *   .emphasis('remember')
   *   .text(' to save your work.');
   * 
   * // Reduced emphasis for de-emphasis
   * sentence
   *   .emphasis('(optional)', 'reduced')
   *   .text(' You can also add notes.');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-emphasis} Emphasis Element Documentation
   */
  emphasis(text: string, level?: EmphasisLevel): this {
    this.sentence.addElement(new EmphasisElement(text, level));
    return this;
  }

  /**
   * Specifies exact phonetic pronunciation for words within the sentence.
   * Provides precise control over pronunciation using phonetic alphabets.
   * 
   * This is essential for proper names, technical terms, or words that might
   * be mispronounced by the default text-to-speech engine.
   * 
   * @param text - The text to pronounce
   * @param options - Phoneme configuration
   * @param options.alphabet - Phonetic alphabet: 'ipa' (International Phonetic Alphabet), 'sapi' (Microsoft SAPI), or 'ups' (Universal Phone Set)
   * @param options.ph - Phonetic transcription in the specified alphabet
   * @returns This SentenceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // IPA example for technical terms
   * sentence
   *   .text('The ')
   *   .phoneme('API', {
   *     alphabet: 'ipa',
   *     ph: 'eɪpiːˈaɪ'
   *   })
   *   .text(' returns JSON data.');
   * 
   * // SAPI example for names
   * sentence
   *   .text('Contact ')
   *   .phoneme('Nguyen', {
   *     alphabet: 'sapi',
   *     ph: 'w ih n'
   *   })
   *   .text(' for more information.');
   * 
   * // Disambiguating homographs
   * sentence
   *   .text('I need to ')
   *   .phoneme('read', {
   *     alphabet: 'ipa',
   *     ph: 'riːd'  // present tense, not past tense 'rɛd'
   *   })
   *   .text(' this book.');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#use-phonemes-to-improve-pronunciation} Phoneme Element Documentation
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-ssml-phonetic-sets} SSML Phonetic Sets Documentation
   */
  phoneme(text: string, options: PhonemeOptions): this {
    this.sentence.addElement(new PhonemeElement(text, options));
    return this;
  }

  /**
   * Modifies prosody (pitch, rate, volume, contour, range) of speech within the sentence.
   * Allows fine-grained control over how text is spoken for expressive speech.
   * 
   * Prosody modifications can convey emotion, emphasis, or create specific
   * speaking styles like whispering or shouting.
   * 
   * @param text - Text to modify with prosody settings
   * @param options - Prosody configuration options
   * @param options.pitch - Pitch adjustment: absolute (e.g., '200Hz'), relative (e.g., '+2st', '-10%'), or named ('x-low', 'low', 'medium', 'high', 'x-high')
   * @param options.rate - Speaking rate: absolute (e.g., '0.8', '1.2'), relative (e.g., '+10%'), or named ('x-slow', 'slow', 'medium', 'fast', 'x-fast')
   * @param options.volume - Volume level: absolute (e.g., '50', '80%'), relative (e.g., '+10dB'), or named ('silent', 'x-soft', 'soft', 'medium', 'loud', 'x-loud')
   * @param options.contour - Pitch contour as time-position pairs (e.g., '(0%,+20Hz) (50%,-10Hz) (100%,+5Hz)')
   * @param options.range - Pitch range variation: relative (e.g., '+10%', '-2st') or named ('x-low', 'low', 'medium', 'high', 'x-high')
   * @returns This SentenceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Whispering effect
   * sentence
   *   .prosody('This is a secret', {
   *     volume: 'x-soft',
   *     rate: 'slow',
   *     pitch: 'low'
   *   })
   *   .text('!');
   * 
   * // Excited/energetic speech
   * sentence
   *   .prosody('Amazing news everyone', {
   *     rate: '1.2',
   *     pitch: '+10%',
   *     volume: 'loud'
   *   })
   *   .text('!');
   * 
   * // Question intonation with contour
   * sentence.prosody('Are you sure', {
   *   contour: '(0%,+5Hz) (50%,+10Hz) (100%,+20Hz)'
   * });
   * 
   * // Monotone/robotic effect
   * sentence.prosody('I am a robot', {
   *   pitch: 'medium',
   *   range: 'x-low',
   *   rate: '0.9'
   * });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-prosody} Prosody Element Documentation
   */
  prosody(text: string, options: ProsodyOptions): this {
    this.sentence.addElement(new ProsodyElement(text, options));
    return this;
  }

  /**
   * Controls how text is interpreted and pronounced within the sentence.
   * Essential for proper pronunciation of numbers, dates, times, and other formatted text.
   * 
   * The say-as element ensures that specialized text formats are spoken
   * correctly according to their semantic meaning rather than their literal characters.
   * 
   * @param text - Text to interpret
   * @param options - Say-as configuration
   * @param options.interpretAs - Interpretation type: 'address', 'cardinal', 'characters', 'date', 'digits', 'fraction', 'ordinal', 'spell-out', 'telephone', 'time', 'name', 'currency'
   * @param options.format - Format hint for interpretation (varies by interpretAs value)
   * @param options.detail - Additional detail for interpretation (e.g., currency code)
   * @returns This SentenceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Date interpretation
   * sentence
   *   .text('The deadline is ')
   *   .sayAs('2025-12-31', { 
   *     interpretAs: 'date',
   *     format: 'ymd'  // year-month-day
   *   });
   * 
   * // Currency with detail
   * sentence
   *   .text('The total is ')
   *   .sayAs('42.50', { 
   *     interpretAs: 'currency',
   *     detail: 'USD'
   *   });
   * 
   * // Phone number
   * sentence
   *   .text('Call us at ')
   *   .sayAs('1-800-555-1234', { 
   *     interpretAs: 'telephone'
   *   });
   * 
   * // Ordinal numbers
   * sentence
   *   .text('She came in ')
   *   .sayAs('3', { interpretAs: 'ordinal' })
   *   .text(' place.');  // "third place"
   * 
   * // Spell out acronyms
   * sentence
   *   .sayAs('API', { interpretAs: 'spell-out' })
   *   .text(' stands for Application Programming Interface.');
   * 
   * // Time with 24-hour format
   * sentence
   *   .text('The meeting starts at ')
   *   .sayAs('14:30:00', { 
   *     interpretAs: 'time',
   *     format: 'hms24'
   *   });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#say-as-element} Say-As Element Documentation
   */
  sayAs(text: string, options: SayAsOptions): this {
    this.sentence.addElement(new SayAsElement(text, options));
    return this;
  }

  /**
   * Substitutes text with an alias for pronunciation within the sentence.
   * Useful for acronyms, abbreviations, or any text that should be spoken differently than written.
   * 
   * The sub element allows you to display one text while having the speech
   * synthesizer pronounce something different.
   * 
   * @param original - The text as it appears in writing
   * @param alias - How the text should be pronounced
   * @returns This SentenceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Acronym expansion
   * sentence
   *   .text('The ')
   *   .sub('CEO', 'Chief Executive Officer')
   *   .text(' will speak at the ')
   *   .sub('AGM', 'Annual General Meeting')
   *   .text('.');
   * 
   * // Technical abbreviations
   * sentence
   *   .sub('Dr.', 'Doctor')
   *   .text(' Smith studies ')
   *   .sub('DNA', 'deoxyribonucleic acid')
   *   .text('.');
   * 
   * // Custom pronunciations
   * sentence
   *   .text('Visit ')
   *   .sub('www.example.com', 'w w w dot example dot com')
   *   .text(' for more information.');
   * 
   * // Chemical formulas
   * sentence
   *   .text('Water is ')
   *   .sub('H2O', 'H two O')
   *   .text('.');
   * ```
   * 
   * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.11} W3C Sub Element Specification
   */
  sub(original: string, alias: string): this {
    this.sentence.addElement(new SubElement(original, alias));
    return this;
  }

  /**
   * Renders the sentence element as an XML string.
   * This method is called internally by the SSML builder to generate the final XML.
   * 
   * The rendered output includes the `<s>` tags and all child elements properly formatted
   * as valid SSML XML content.
   * 
   * @returns The sentence element as an XML string with all its content
   * @internal
   * 
   * @example
   * ```typescript
   * const xml = sentenceBuilder.render();
   * // Returns: <s>sentence content with all elements</s>
   * ```
   */
  render(): string {
    return this.sentence.render();
  }
}
