import { SSMLElement } from '../core/SSMLElement';
import type { PhonemeOptions } from '../types';

/**
 * SSML element for specifying exact phonetic pronunciation of text.
 * 
 * The `<phoneme>` element provides precise control over pronunciation by specifying
 * the phonetic transcription of words using standard phonetic alphabets. This is essential
 * for proper names, technical terms, foreign words, or any text that the speech synthesizer
 * might pronounce incorrectly by default. The element ensures consistent and accurate
 * pronunciation across different voices and languages.
 * 
 * The phoneme element supports multiple phonetic alphabets including IPA (International
 * Phonetic Alphabet), SAPI (Microsoft Speech API), and UPS (Universal Phone Set), allowing
 * developers to choose the most appropriate system for their needs.
 * 
 * @example
 * ```typescript
 * // IPA pronunciation
 * const phoneme = new PhonemeElement('schedule', {
 *   alphabet: 'ipa',
 *   ph: 'ˈʃɛdjuːl'  // British pronunciation
 * });
 * phoneme.render();
 * // Output: <phoneme alphabet="ipa" ph="ˈʃɛdjuːl">schedule</phoneme>
 * 
 * // SAPI pronunciation
 * const sapi = new PhonemeElement('Azure', {
 *   alphabet: 'sapi',
 *   ph: 'ae zh er'
 * });
 * 
 * // Use with SSMLBuilder
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('The word ')
 *     .phoneme('tomato', { alphabet: 'ipa', ph: 'təˈmeɪtoʊ' })
 *     .text(' has different pronunciations.')
 *   .build();
 * ```
 * 
 * @remarks
 * - The phoneme element can only contain text and no other elements
 * - The text content is what appears visually, while the ph attribute determines pronunciation
 * - Different voices may support different phonetic alphabets
 * - IPA is the most universally supported alphabet
 * - SAPI is optimized for Microsoft voices
 * - Special XML characters in text are automatically escaped
 * - Incorrect phonetic transcriptions may result in unexpected pronunciation
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#use-phonemes-to-improve-pronunciation} Phoneme Element Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-ssml-phonetic-sets} SSML Phonetic Sets Reference
 * @see {@link https://www.w3.org/TR/speech-synthesis11/#S3.1.10} W3C SSML Phoneme Specification
 */
export class PhonemeElement extends SSMLElement {
  /**
   * The text to be displayed and pronounced.
   * @private
   */
  private text: string;
  
  /**
   * Configuration options for the phonetic pronunciation.
   * @private
   */
  private options: PhonemeOptions;

  /**
   * Creates a new PhonemeElement instance.
   * 
   * @param text - The text content to be pronounced.
   *               This is the written form that appears in the document.
   *               Special XML characters (&, <, >, ", ') are automatically escaped.
   *               The actual pronunciation is determined by the ph attribute.
   * 
   * @param options - Configuration for phonetic pronunciation
   * @param options.alphabet - The phonetic alphabet to use:
   *                          - `ipa`: International Phonetic Alphabet (universal standard)
   *                          - `sapi`: Microsoft Speech API phonemes (optimized for English)
   *                          - `ups`: Universal Phone Set (Microsoft's unified system)
   * @param options.ph - The phonetic transcription in the specified alphabet.
   *                     Must be a valid transcription according to the chosen alphabet's rules.
   *                     Spaces typically separate phonemes in SAPI/UPS formats.
   * 
   * @example
   * ```typescript
   * // IPA for international use
   * const ipaExample = new PhonemeElement('schedule', {
   *   alphabet: 'ipa',
   *   ph: 'ˈskɛdʒuːl'  // American pronunciation
   * });
   * 
   * // SAPI for Microsoft voices
   * const sapiExample = new PhonemeElement('SQL', {
   *   alphabet: 'sapi',
   *   ph: 'eh s k y uw eh l'
   * });
   * 
   * // Technical terms
   * const techTerm = new PhonemeElement('Kubernetes', {
   *   alphabet: 'ipa',
   *   ph: 'kuːbərˈnetiːz'
   * });
   * 
   * // Disambiguating homographs
   * const present = new PhonemeElement('read', {
   *   alphabet: 'ipa',
   *   ph: 'riːd'  // Present tense, not past tense 'rɛd'
   * });
   * 
   * // Foreign names
   * const name = new PhonemeElement('Nguyen', {
   *   alphabet: 'ipa',
   *   ph: 'ŋwiən'
   * });
   * 
   * // Company/product names
   * const product = new PhonemeElement('iPhone', {
   *   alphabet: 'sapi',
   *   ph: 'ay f ow n'
   * });
   * ```
   */
  constructor(text: string, options: PhonemeOptions) {
    super();
    this.text = text;
    this.options = options;
  }

  /**
   * Renders the phoneme element as an SSML XML string.
   * 
   * Generates the `<phoneme>` element with the alphabet and ph attributes specifying
   * the phonetic transcription. The text content is automatically escaped to prevent
   * XML injection and ensure valid output. The rendered element instructs the speech
   * synthesizer to use the specified phonetic pronunciation instead of its default
   * text-to-phoneme conversion.
   * 
   * @returns The XML string representation of the phoneme element in the format:
   *          `<phoneme alphabet="alphabet" ph="transcription">text</phoneme>`
   * 
   * @example
   * ```typescript
   * // IPA example
   * const ipa = new PhonemeElement('schedule', {
   *   alphabet: 'ipa',
   *   ph: 'ˈʃɛdjuːl'
   * });
   * console.log(ipa.render());
   * // Output: <phoneme alphabet="ipa" ph="ˈʃɛdjuːl">schedule</phoneme>
   * 
   * // SAPI example
   * const sapi = new PhonemeElement('Azure', {
   *   alphabet: 'sapi',
   *   ph: 'ae zh er'
   * });
   * console.log(sapi.render());
   * // Output: <phoneme alphabet="sapi" ph="ae zh er">Azure</phoneme>
   * 
   * // With special characters (automatically escaped)
   * const special = new PhonemeElement('AT&T', {
   *   alphabet: 'sapi',
   *   ph: 'ey t ih n t ih'
   * });
   * console.log(special.render());
   * // Output: <phoneme alphabet="sapi" ph="ey t ih n t ih">AT&amp;T</phoneme>
   * 
   * // UPS example
   * const ups = new PhonemeElement('hello', {
   *   alphabet: 'ups',
   *   ph: 'H EH L OW'
   * });
   * console.log(ups.render());
   * // Output: <phoneme alphabet="ups" ph="H EH L OW">hello</phoneme>
   * ```
   * 
   * @override
   */
  render(): string {
    return `<phoneme alphabet="${this.options.alphabet}" ph="${this.options.ph}">${this.escapeXml(this.text)}</phoneme>`;
  }
}
