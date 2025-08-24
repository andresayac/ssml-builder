import { SSMLElement } from '../core/SSMLElement';
import type { VoiceOptions, BreakOptions, SilenceOptions, EmphasisLevel, ProsodyOptions, ExpressAsOptions, SayAsOptions, PhonemeOptions } from '../types';
import { BreakElement } from '../elements/BreakElement';
import { SilenceElement } from '../elements/SilenceElement';
import { ParagraphElement } from '../elements/ParagraphElement';
import { SentenceElement } from '../elements/SentenceElement';
import { EmphasisElement } from '../elements/EmphasisElement';
import { ProsodyElement } from '../elements/ProsodyElement';
import { ExpressAsElement } from '../elements/ExpressAsElement';
import { SayAsElement } from '../elements/SayAsElement';
import { BookmarkElement } from '../elements/BookmarkElement';
import { AudioElement } from '../elements/AudioElement';
import { SubElement } from '../elements/SubElement';
import { PhonemeElement } from '../elements/PhonemeElement';
import { LangElement } from '../elements/LangElement';
import { LexiconElement } from '../elements/LexiconElement';
import { MathElement } from '../elements/MathElement';
import { AudioDurationElement } from '../elements/AudioDurationElement';
import { TTSEmbeddingElement } from '../elements/TTSEmbeddingElement';
import { VisemeElement } from '../elements/VisemeElement';
import type { SSMLBuilder } from '../core/SSMLBuilder';

/**
 * Builder class for creating voice-specific content within an SSML document.
 * Provides a fluent API for adding text, pauses, emphasis, prosody, and other speech synthesis features.
 * 
 * This class encapsulates all the content that will be spoken by a specific voice,
 * including text, audio, and various speech modification elements.
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const builder = new SSMLBuilder({ lang: 'en-US' });
 * builder
 *   .voice('en-US-AvaNeural')
 *     .text('Hello, world!')
 *     .break('500ms')
 *     .emphasis('Important!', 'strong')
 *   .build();
 * ```
 * 
 * @example
 * ```typescript
 * // Advanced usage with emotions and prosody
 * builder
 *   .voice('en-US-AvaNeural')
 *     .expressAs('I am so happy!', { style: 'cheerful' })
 *     .prosody('Speaking slowly', { rate: 'slow', pitch: 'low' })
 *     .paragraph(p => p
 *       .text('This is a paragraph.')
 *       .sentence(s => s.text('With a sentence.'))
 *     )
 *   .build();
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#voice-element} Azure Voice Element Documentation
 */
export class VoiceBuilder extends SSMLElement {
  /** Internal array storing all content elements for this voice */
  private content: (string | SSMLElement)[] = [];
  
  /** Configuration options for this voice */
  private options: VoiceOptions;
  
  /** Reference to parent SSMLBuilder for method chaining */
  private parent?: SSMLBuilder;

  /**
   * Creates a new VoiceBuilder instance.
   * 
   * @param options - Voice configuration options
   * @param options.name - The voice name (e.g., 'en-US-AvaNeural')
   * @param options.effect - Optional voice effect (e.g., 'eq_car', 'eq_telecomhp8k')
   * @param parent - Optional reference to parent SSMLBuilder for chaining
   * 
   * @example
   * ```typescript
   * const voiceBuilder = new VoiceBuilder({ 
   *   name: 'en-US-AvaNeural',
   *   effect: 'eq_car' 
   * });
   * ```
   */
  constructor(options: VoiceOptions, parent?: SSMLBuilder) {
    super();
    this.options = options;
    this.parent = parent;
  }

  /**
   * Adds plain text to be spoken by the voice.
   * Special characters (&, <, >, ", ') are automatically escaped.
   * 
   * @param text - The text to be spoken
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice.text('Hello, world!');
   * // Multiple text segments can be chained
   * voice
   *   .text('First part. ')
   *   .text('Second part.');
   * ```
   */
  text(text: string): this {
    this.content.push(text);
    return this;
  }

  /**
   * Adds a pause or break in speech.
   * Can specify either duration or strength of the pause.
   * 
   * @param options - Break configuration or duration string
   * @param options.strength - Pause strength: 'x-weak' (250ms), 'weak' (500ms), 'medium' (750ms), 'strong' (1000ms), 'x-strong' (1250ms)
   * @param options.time - Explicit duration (e.g., '500ms', '2s'). Range: 0-20000ms
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Using duration string
   * voice.break('500ms');
   * voice.break('2s');
   * 
   * // Using strength
   * voice.break({ strength: 'medium' });
   * 
   * // Using explicit time (overrides strength)
   * voice.break({ time: '750ms' });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-a-break} Break Element Documentation
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
   * Adds silence at specific positions in the speech.
   * More precise than break element for controlling silence placement.
   * 
   * @param options - Silence configuration
   * @param options.type - Where to add silence (e.g., 'Sentenceboundary', 'Leading', 'Tailing')
   * @param options.value - Duration of silence (e.g., '200ms', '1s'). Range: 0-20000ms
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Add silence between sentences
   * voice.silence({ type: 'Sentenceboundary', value: '500ms' });
   * 
   * // Add leading silence
   * voice.silence({ type: 'Leading', value: '200ms' });
   * 
   * // Add exact silence at comma
   * voice.silence({ type: 'Comma-exact', value: '150ms' });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-silence} Silence Element Documentation
   */
  silence(options: SilenceOptions): this {
    this.content.push(new SilenceElement(options));
    return this;
  }

  /**
   * Adds a paragraph with structured content.
   * Paragraphs help organize speech into logical blocks.
   * 
   * @param callback - Function to build paragraph content
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice.paragraph(p => p
   *   .text('This is the first sentence. ')
   *   .text('This is the second sentence.')
   *   .sayAs('2025', { interpretAs: 'date' })
   * );
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#specify-paragraphs-and-sentences} Paragraph Element Documentation
   */
  paragraph(callback: (p: ParagraphElement) => void): this {
    const paragraphElement = new ParagraphElement();
    callback(paragraphElement);
    this.content.push(paragraphElement);
    return this;
  }

  /**
   * Adds a sentence with structured content.
   * Sentences help define clear boundaries for intonation and pauses.
   * 
   * @param callback - Function to build sentence content
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice.sentence(s => s
   *   .text('This is a complete sentence.')
   *   .break('200ms')
   * );
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#specify-paragraphs-and-sentences} Sentence Element Documentation
   */
  sentence(callback: (s: SentenceElement) => void): this {
    const sentenceElement = new SentenceElement();
    callback(sentenceElement);
    this.content.push(sentenceElement);
    return this;
  }

  /**
   * Adds emphasized speech with adjustable intensity.
   * Changes the speaking style to emphasize certain words or phrases.
   * 
   * @param text - Text to emphasize
   * @param level - Emphasis level: 'strong' | 'moderate' | 'reduced'. Default is 'moderate'
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice
   *   .text('This is ')
   *   .emphasis('very important', 'strong')
   *   .text(' information.');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-emphasis} Emphasis Element Documentation
   */
  emphasis(text: string, level?: EmphasisLevel): this {
    this.content.push(new EmphasisElement(text, level));
    return this;
  }

  /**
   * Modifies prosody (pitch, rate, volume, contour, range) of speech.
   * Allows fine-grained control over how text is spoken.
   * 
   * @param text - Text to modify
   * @param options - Prosody configuration options
   * @param options.pitch - Pitch adjustment: '+10Hz', '-2st', 'x-low', 'low', 'medium', 'high', 'x-high', '+10%', '-10%'
   * @param options.rate - Speaking rate: 'x-slow', 'slow', 'medium', 'fast', 'x-fast', '0.5', '2.0', '+10%'
   * @param options.volume - Volume level: 'silent', 'x-soft', 'soft', 'medium', 'loud', 'x-loud', '+10dB', '50%'
   * @param options.contour - Pitch contour changes (e.g., '(0%,+20Hz) (50%,-10Hz)')
   * @param options.range - Pitch range variation
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Slow and quiet speech
   * voice.prosody('Speaking slowly and quietly', {
   *   rate: 'slow',
   *   volume: 'soft',
   *   pitch: 'low'
   * });
   * 
   * // Precise numeric values
   * voice.prosody('Precise control', {
   *   rate: '0.8',
   *   pitch: '+5%',
   *   volume: '+10dB'
   * });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-prosody} Prosody Element Documentation
   */
  prosody(text: string, options: ProsodyOptions): this {
    this.content.push(new ProsodyElement(text, options));
    return this;
  }

  /**
   * Expresses emotion or speaking style (Azure Speech Service specific).
   * Only available for certain neural voices.
   * 
   * @param text - Text to express with style
   * @param options - Expression configuration
   * @param options.style - Style name (e.g., 'cheerful', 'sad', 'angry', 'excited', 'friendly', 'terrified', 'shouting', 'whispering')
   * @param options.styledegree - Intensity of style: '0.01' to '2' (default: '1')
   * @param options.role - Speaking role (e.g., 'Girl', 'Boy', 'YoungAdultFemale', 'OlderAdultMale')
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Express with emotion
   * voice.expressAs('I am so happy to see you!', {
   *   style: 'cheerful',
   *   styledegree: '2'
   * });
   * 
   * // Express with role
   * voice.expressAs('Once upon a time...', {
   *   style: 'narration-professional',
   *   role: 'OlderAdultMale'
   * });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#express-as-element} Express-As Element Documentation
   */
  expressAs(text: string, options: ExpressAsOptions): this {
    this.content.push(new ExpressAsElement(text, options));
    return this;
  }

  /**
   * Controls how text is interpreted and pronounced.
   * Useful for dates, numbers, currency, abbreviations, etc.
   * 
   * @param text - Text to interpret
   * @param options - Say-as configuration
   * @param options.interpretAs - How to interpret text: 'address', 'cardinal', 'characters', 'date', 'digits', 'fraction', 'ordinal', 'spell-out', 'telephone', 'time', 'name', 'currency'
   * @param options.format - Format specification (depends on interpretAs)
   * @param options.detail - Additional detail for interpretation
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Date interpretation
   * voice.sayAs('2025-08-24', { 
   *   interpretAs: 'date', 
   *   format: 'ymd' 
   * });
   * 
   * // Currency
   * voice.sayAs('42.50', { 
   *   interpretAs: 'currency',
   *   detail: 'USD'
   * });
   * 
   * // Spell out
   * voice.sayAs('SSML', { interpretAs: 'spell-out' });
   * 
   * // Phone number
   * voice.sayAs('1234567890', { interpretAs: 'telephone' });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#say-as-element} Say-As Element Documentation
   */
  sayAs(text: string, options: SayAsOptions): this {
    this.content.push(new SayAsElement(text, options));
    return this;
  }

  /**
   * Adds a bookmark marker in the SSML for event tracking.
   * Does not produce any speech output.
   * 
   * @param mark - Unique identifier for the bookmark
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice
   *   .text('Introduction')
   *   .bookmark('intro_end')
   *   .text('Main content')
   *   .bookmark('main_start');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#bookmark-element} Bookmark Element Documentation
   */
  bookmark(mark: string): this {
    this.content.push(new BookmarkElement(mark));
    return this;
  }

  /**
   * Inserts an audio file into the speech output.
   * Supports fallback text if audio is unavailable.
   * 
   * @param src - URL of the audio file (must be publicly accessible HTTPS URL)
   * @param fallbackText - Optional text to speak if audio fails to load
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // With fallback text
   * voice.audio(
   *   'https://example.com/sound.mp3',
   *   'Sound effect here'
   * );
   * 
   * // Without fallback
   * voice.audio('https://example.com/music.mp3');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-recorded-audio} Audio Element Documentation
   */
  audio(src: string, fallbackText?: string): this {
    this.content.push(new AudioElement(src, fallbackText));
    return this;
  }

  /**
   * Substitutes text with an alias for pronunciation.
   * Useful for acronyms or text that should be pronounced differently.
   * 
   * @param original - Original text to display
   * @param alias - How the text should be pronounced
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice
   *   .text('The ')
   *   .sub('W3C', 'World Wide Web Consortium')
   *   .text(' sets web standards.');
   * ```
   */
  sub(original: string, alias: string): this {
    this.content.push(new SubElement(original, alias));
    return this;
  }

  /**
   * Specifies exact phonetic pronunciation using phonetic alphabets.
   * Provides precise control over pronunciation.
   * 
   * @param text - Text to pronounce
   * @param options - Phoneme configuration
   * @param options.alphabet - Phonetic alphabet: 'ipa' | 'sapi' | 'ups'
   * @param options.ph - Phonetic transcription
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // IPA pronunciation
   * voice.phoneme('tomato', {
   *   alphabet: 'ipa',
   *   ph: 'təˈmeɪtoʊ'
   * });
   * 
   * // SAPI pronunciation
   * voice.phoneme('read', {
   *   alphabet: 'sapi',
   *   ph: 'r eh d'
   * });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#use-phonemes-to-improve-pronunciation} Phoneme Element Documentation
   */
  phoneme(text: string, options: PhonemeOptions): this {
    this.content.push(new PhonemeElement(text, options));
    return this;
  }

  /**
   * Changes language for a portion of text.
   * Useful for multilingual content.
   * 
   * @param lang - Language code (e.g., 'es-ES', 'fr-FR', 'de-DE')
   * @param callback - Function to build content in the specified language
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice
   *   .text('Hello! ')
   *   .lang('es-ES', lang => lang
   *     .text('¡Hola! ')
   *   )
   *   .lang('fr-FR', lang => lang
   *     .text('Bonjour!')
   *   );
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#use-multiple-languages} Lang Element Documentation
   */
  lang(lang: string, callback: (element: LangElement) => void): this {
    const element = new LangElement(lang);
    callback(element);
    this.content.push(element);
    return this;
  }

  /**
   * References an external pronunciation lexicon file.
   * Allows custom pronunciations to be defined externally.
   * 
   * @param uri - URL of the lexicon file (must be publicly accessible HTTPS URL)
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice.lexicon('https://example.com/lexicon.xml');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#pronunciation-lexicon} Lexicon Element Documentation
   */
  lexicon(uri: string): this {
    this.content.push(new LexiconElement(uri));
    return this;
  }

  /**
   * Embeds MathML content for mathematical expressions.
   * The math content will be spoken as mathematical notation.
   * 
   * @param mathML - MathML markup string
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice.math(`
   *   <math xmlns="http://www.w3.org/1998/Math/MathML">
   *     <mrow>
   *       <mi>a</mi>
   *       <mo>+</mo>
   *       <mi>b</mi>
   *     </mrow>
   *   </math>
   * `);
   * ```
   */
  math(mathML: string): this {
    this.content.push(new MathElement(mathML));
    return this;
  }

  /**
   * Controls the total audio duration (Azure Speech Service specific).
   * Can speed up or slow down speech to fit a specific duration.
   * 
   * @param value - Target duration (e.g., '10s', '5000ms')
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice
   *   .audioDuration('10s')
   *   .text('This text will be adjusted to last exactly 10 seconds.');
   * ```
   */
  audioDuration(value: string): this {
    this.content.push(new AudioDurationElement(value));
    return this;
  }

  /**
   * Uses a custom speaker profile for voice synthesis (Azure Speech Service specific).
   * Requires a pre-trained speaker profile.
   * 
   * @param speakerProfileId - ID of the speaker profile
   * @param text - Text to speak with the custom voice
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice.ttsEmbedding(
   *   'profile-id-123',
   *   'This is spoken with a custom voice profile.'
   * );
   * ```
   */
  ttsEmbedding(speakerProfileId: string, text: string): this {
    this.content.push(new TTSEmbeddingElement(speakerProfileId, text));
    return this;
  }

  /**
   * Adds viseme information for lip-sync animations (Azure Speech Service specific).
   * Used for avatar or character animation synchronization.
   * 
   * @param type - Viseme type (e.g., 'redlips_front', 'redlips_back')
   * @returns This VoiceBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * voice
   *   .viseme('redlips_front')
   *   .text('This text includes viseme data for animation.');
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-speech-synthesis-viseme} Viseme Documentation
   */
  viseme(type: string): this {
    this.content.push(new VisemeElement(type));
    return this;
  }

  /**
   * Builds the complete SSML document and returns it as a string.
   * Delegates to the parent SSMLBuilder's build method.
   * 
   * @returns The complete SSML document as an XML string
   * @throws {Error} If VoiceBuilder was not created from an SSMLBuilder
   * 
   * @example
   * ```typescript
   * const ssml = new SSMLBuilder({ lang: 'en-US' })
   *   .voice('en-US-AvaNeural')
   *     .text('Hello!')
   *   .build();
   * // Returns: <speak version="1.0" ...><voice name="en-US-AvaNeural">Hello!</voice></speak>
   * ```
   */
  build(): string {
    if (!this.parent) {
      throw new Error('VoiceBuilder must be created from SSMLBuilder to use build()');
    }
    return this.parent.build();
  }

  /**
   * Switches to a different voice while maintaining the fluent API chain.
   * Allows multiple voices in the same SSML document.
   * 
   * @param name - Name of the new voice (e.g., 'en-US-AndrewNeural')
   * @param effect - Optional voice effect for the new voice
   * @returns A new VoiceBuilder instance for the specified voice
   * @throws {Error} If VoiceBuilder was not created from an SSMLBuilder
   * 
   * @example
   * ```typescript
   * new SSMLBuilder({ lang: 'en-US' })
   *   .voice('en-US-AvaNeural')
   *     .text('Hello from Ava!')
   *   .voice('en-US-AndrewNeural')
   *     .text('Hello from Andrew!')
   *   .build();
   * ```
   */
  voice(name: string, effect?: string): VoiceBuilder {
    if (!this.parent) {
      throw new Error('VoiceBuilder must be created from SSMLBuilder to chain voices');
    }
    return this.parent.voice(name, effect);
  }

  /**
   * Renders this voice element as an XML string.
   * Internal method used by SSMLBuilder.
   * 
   * @returns The voice element as an XML string
   * @internal
   * 
   * @example
   * ```typescript
   * // Internal usage
   * const xml = voiceBuilder.render();
   * // Returns: <voice name="en-US-AvaNeural">content here</voice>
   * ```
   */
  render(): string {
    const attrs = [`name="${this.options.name}"`];
    if (this.options.effect) {
      attrs.push(`effect="${this.options.effect}"`);
    }
    
    const contentStr = this.content.map(c => 
      typeof c === 'string' ? this.escapeXml(c) : c.render()
    ).join('');
    
    return `<voice ${attrs.join(' ')}>${contentStr}</voice>`;
  }
}
