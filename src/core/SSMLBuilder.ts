import { SSMLElement } from './SSMLElement';
import type { SSMLOptions, BackgroundAudioOptions } from '../types';
import { VoiceBuilder } from '../builders/VoiceBuilder';
import { BackgroundAudioElement } from '../elements/BackgroundAudioElement';
import { VoiceConversionElement } from '../elements/VoiceConversionElement';

/**
 * Main builder class for creating SSML (Speech Synthesis Markup Language) documents.
 * Provides a fluent, type-safe API for constructing speech synthesis instructions
 * compatible with Azure Speech Service and other SSML-compliant text-to-speech engines.
 * 
 * The SSMLBuilder is the entry point for creating SSML documents. It manages the root
 * `<speak>` element and allows you to add voices, background audio, and voice conversion settings.
 * 
 * @example
 * ```typescript
 * // Basic single voice example
 * const ssml = new SSMLBuilder({ lang: 'en-US' })
 *   .voice('en-US-AvaNeural')
 *     .text('Hello, world!')
 *   .build();
 * ```
 * 
 * @example
 * ```typescript
 * // Multiple voices with background audio
 * const conversation = new SSMLBuilder({ lang: 'en-US' })
 *   .backgroundAudio({
 *     src: 'https://example.com/music.mp3',
 *     volume: '0.5',
 *     fadein: '2000ms'
 *   })
 *   .voice('en-US-AvaNeural')
 *     .text('Hello from Ava!')
 *   .voice('en-US-AndrewNeural')
 *     .text('Hello from Andrew!')
 *   .build();
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation
 * @see {@link https://www.w3.org/TR/speech-synthesis11/} W3C SSML Specification
 */
export class SSMLBuilder {
  /** Collection of voice and other SSML elements in the document */
  private elements: SSMLElement[] = [];
  
  /** Configuration options for the SSML document */
  private options: SSMLOptions;
  
  /** Optional background audio element for the entire document */
  private _backgroundAudio?: BackgroundAudioElement;
  
  /** Optional voice conversion element for voice transformation */
  private _voiceConversion?: VoiceConversionElement;

  /**
   * Creates a new SSML document builder with the specified configuration.
   * 
   * The constructor sets up the SSML document with proper XML namespaces and version
   * information required for speech synthesis services.
   * 
   * @param options - Configuration options for the SSML document
   * @param options.lang - The language/locale code for the document (e.g., 'en-US', 'es-ES', 'fr-FR').
   *                       This sets the default language for all content unless overridden.
   * @param options.version - SSML version (defaults to '1.0'). Currently only '1.0' is supported.
   * @param options.xmlns - XML namespace for SSML (defaults to W3C standard).
   * @param options.xmlnsMstts - Microsoft Text-to-Speech namespace for Azure-specific features.
   * 
   * @example
   * ```typescript
   * // US English
   * const builder = new SSMLBuilder({ lang: 'en-US' });
   * 
   * // Spanish (Spain)
   * const builderES = new SSMLBuilder({ lang: 'es-ES' });
   * 
   * // French (France)
   * const builderFR = new SSMLBuilder({ lang: 'fr-FR' });
   * 
   * // With custom namespace (rare)
   * const customBuilder = new SSMLBuilder({
   *   lang: 'en-US',
   *   version: '1.0',
   *   xmlns: 'http://www.w3.org/2001/10/synthesis',
   *   xmlnsMstts: 'https://www.w3.org/2001/mstts'
   * });
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support} Supported Languages
   */
  constructor(options: SSMLOptions) {
    this.options = {
      version: '1.0',
      xmlns: 'http://www.w3.org/2001/10/synthesis',
      xmlnsMstts: 'https://www.w3.org/2001/mstts',
      ...options
    };
  }

  /**
   * Adds a voice element to the SSML document and returns a VoiceBuilder for adding content.
   * 
   * Each voice element can contain text, audio, and various speech modification elements.
   * You can add multiple voice elements to create conversations or switch between different
   * voices within the same document.
   * 
   * The VoiceBuilder returned from this method provides a fluent API for adding all types
   * of content that should be spoken by this voice.
   * 
   * @param name - The voice name identifier (e.g., 'en-US-AvaNeural', 'en-US-AndrewMultilingualNeural').
   *               Must be a valid voice name supported by your speech service.
   * @param effect - Optional voice effect to apply. Available effects include:
   *                 - 'eq_car' - Optimized for car speakers
   *                 - 'eq_telecomhp8k' - Telephone audio (8kHz sampling)
   *                 - 'eq_telecomhp3k' - Telephone audio (3kHz sampling)
   * @returns A VoiceBuilder instance for adding content to be spoken by this voice
   * 
   * @example
   * ```typescript
   * // Single voice
   * builder
   *   .voice('en-US-AvaNeural')
   *     .text('Hello, I am Ava.')
   *   .build();
   * 
   * // Multiple voices for conversation
   * builder
   *   .voice('en-US-AvaNeural')
   *     .text('Hello, Andrew!')
   *   .voice('en-US-AndrewNeural')
   *     .text('Hi Ava, how are you?')
   *   .voice('en-US-AvaNeural')
   *     .text('I am doing great, thanks!')
   *   .build();
   * 
   * // Voice with effect
   * builder
   *   .voice('en-US-AvaNeural', 'eq_telecomhp8k')
   *     .text('This sounds like a phone call.')
   *   .build();
   * 
   * // Multilingual voice
   * builder
   *   .voice('en-US-AvaMultilingualNeural')
   *     .text('Hello! ')
   *     .lang('es-ES', lang => lang.text('¡Hola! '))
   *     .lang('fr-FR', lang => lang.text('Bonjour!'))
   *   .build();
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#neural-voices} Available Neural Voices
   * @see {@link VoiceBuilder} For available methods on the returned builder
   */
  voice(name: string, effect?: string): VoiceBuilder {
    // Pass 'this' as parent to VoiceBuilder
    const voiceBuilder = new VoiceBuilder({ name, effect }, this);
    this.elements.push(voiceBuilder);
    return voiceBuilder;
  }

  /**
   * Adds background audio that plays throughout the entire SSML document.
   * 
   * Background audio is useful for adding ambient music, sound effects, or any audio
   * that should play behind the spoken content. The audio automatically adjusts its
   * duration to match the speech duration.
   * 
   * Only one background audio can be set per SSML document. Calling this method
   * multiple times will replace the previous background audio setting.
   * 
   * @param options - Background audio configuration
   * @param options.src - URL of the audio file. Must be:
   *                      - Publicly accessible HTTPS URL
   *                      - MP3, WAV, or other supported audio format
   *                      - Maximum file size depends on service limits
   * @param options.volume - Volume level of background audio. Can be:
   *                         - Decimal value: '0.0' (silent) to '1.0' (full volume)
   *                         - Percentage: '0%' to '100%'
   *                         - Decibels: '+0dB', '-6dB' (negative values reduce volume)
   * @param options.fadein - Duration of fade-in effect at the start (e.g., '2000ms', '2s')
   * @param options.fadeout - Duration of fade-out effect at the end (e.g., '1000ms', '1s')
   * @returns This SSMLBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Basic background music
   * builder
   *   .backgroundAudio({
   *     src: 'https://example.com/background-music.mp3'
   *   })
   *   .voice('en-US-AvaNeural')
   *     .text('This speech has background music.')
   *   .build();
   * 
   * // With volume and fade effects
   * builder
   *   .backgroundAudio({
   *     src: 'https://example.com/ambient.mp3',
   *     volume: '0.3',  // 30% volume
   *     fadein: '3000ms',  // 3-second fade in
   *     fadeout: '2000ms'  // 2-second fade out
   *   })
   *   .voice('en-US-AvaNeural')
   *     .text('Welcome to our podcast!')
   *   .build();
   * 
   * // Ambient sound for meditation app
   * builder
   *   .backgroundAudio({
   *     src: 'https://example.com/ocean-waves.mp3',
   *     volume: '0.5',
   *     fadein: '5000ms'
   *   })
   *   .voice('en-US-EmmaNeural')
   *     .prosody('Take a deep breath', { rate: 'slow', volume: 'soft' })
   *   .build();
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-background-audio} Background Audio Documentation
   */
  backgroundAudio(options: BackgroundAudioOptions): this {
    this._backgroundAudio = new BackgroundAudioElement(options);
    return this;
  }

  /**
   * Adds voice conversion to transform the voice characteristics using a custom model.
   * 
   * Voice conversion allows you to modify the voice output using a pre-trained
   * voice conversion model. This is an Azure Speech Service specific feature that
   * requires a custom voice model URL.
   * 
   * Only one voice conversion can be set per SSML document. The conversion applies
   * to all voices in the document.
   * 
   * @param url - URL of the voice conversion model. Must be:
   *              - A valid HTTPS URL to a voice conversion model
   *              - Accessible by the Azure Speech Service
   *              - In the correct format for voice conversion
   * @returns This SSMLBuilder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Apply voice conversion to all voices
   * builder
   *   .voiceConversion('https://example.com/custom-voice-model.json')
   *   .voice('en-US-AvaNeural')
   *     .text('This voice will be converted.')
   *   .build();
   * 
   * // Voice conversion with multiple speakers
   * builder
   *   .voiceConversion('https://example.com/voice-transform.json')
   *   .voice('en-US-AvaNeural')
   *     .text('Original voice A transformed.')
   *   .voice('en-US-AndrewNeural')
   *     .text('Original voice B also transformed.')
   *   .build();
   * ```
   * 
   * @experimental This feature is in preview and may change in future versions
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/voice-conversion} Voice Conversion Documentation
   */
  voiceConversion(url: string): this {
    this._voiceConversion = new VoiceConversionElement(url);
    return this;
  }

  /**
   * Builds and returns the complete SSML document as an XML string.
   * 
   * This method assembles all the elements added to the builder into a valid SSML
   * document that can be sent to a text-to-speech service. The output follows the
   * SSML 1.0 specification with Azure Speech Service extensions.
   * 
   * The generated XML includes:
   * - The root `<speak>` element with proper attributes
   * - Optional `<mstts:backgroundaudio>` element if configured
   * - Optional `<mstts:voiceconversion>` element if configured
   * - All voice elements with their content in the order they were added
   * 
   * @returns The complete SSML document as a formatted XML string
   * 
   * @example
   * ```typescript
   * // Simple build
   * const ssml = new SSMLBuilder({ lang: 'en-US' })
   *   .voice('en-US-AvaNeural')
   *     .text('Hello, world!')
   *   .build();
   * 
   * console.log(ssml);
   * // Output:
   * // <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
   * //        xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
   * //     <voice name="en-US-AvaNeural">Hello, world!</voice>
   * // </speak>
   * 
   * // Complex build with all features
   * const complexSSML = new SSMLBuilder({ lang: 'en-US' })
   *   .backgroundAudio({
   *     src: 'https://example.com/music.mp3',
   *     volume: '0.3'
   *   })
   *   .voiceConversion('https://example.com/model.json')
   *   .voice('en-US-AvaNeural')
   *     .text('First voice')
   *   .voice('en-US-AndrewNeural')
   *     .text('Second voice')
   *   .build();
   * 
   * // Use the generated SSML with Azure Speech SDK
   * const ssmlForAzure = builder.build();
   * synthesizer.speakSsmlAsync(ssmlForAzure);
   * ```
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#speak-root-element} Speak Element Documentation
   */
  build(): string {
    const attrs = [
      `version="${this.options.version}"`,
      `xmlns="${this.options.xmlns}"`,
      `xmlns:mstts="${this.options.xmlnsMstts}"`,
      `xml:lang="${this.options.lang}"`
    ].join(' ');

    let content = '';
    
    if (this._backgroundAudio) {
      content += '\n    ' + this._backgroundAudio.render();
    }
    
    if (this._voiceConversion) {
      content += '\n    ' + this._voiceConversion.render();
    }
    
    content += this.elements.map(el => '\n    ' + el.render()).join('');
    
    return `<speak ${attrs}>${content}\n</speak>`;
  }
}
