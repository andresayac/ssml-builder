/**
 * Type definitions for SSML element configuration options.
 * 
 * This module contains interfaces that define the configuration options
 * for various SSML elements. These interfaces ensure type safety and
 * provide clear contracts for element construction.
 * 
 * @module elements
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation
 */

/**
 * Configuration options for the SSML document root.
 * 
 * Defines the basic settings for an SSML document including version,
 * language, and XML namespace declarations required for proper parsing
 * by speech synthesis services.
 * 
 * @example
 * ```typescript
 * const options: SSMLOptions = {
 *   lang: 'en-US',
 *   version: '1.0',
 *   xmlns: 'http://www.w3.org/2001/10/synthesis',
 *   xmlnsMstts: 'https://www.w3.org/2001/mstts'
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#speak-root-element} Speak Element Documentation
 */
export interface SSMLOptions {
  /**
   * SSML specification version.
   * 
   * Currently only version "1.0" is supported by the W3C specification
   * and Azure Speech Service. This is typically set automatically.
   * 
   * @defaultValue "1.0"
   * @example "1.0"
   */
  version?: string;

  /**
   * XML namespace for SSML elements.
   * 
   * The standard W3C namespace for SSML. This should not be changed
   * unless you have specific requirements.
   * 
   * @defaultValue "http://www.w3.org/2001/10/synthesis"
   * @example "http://www.w3.org/2001/10/synthesis"
   */
  xmlns?: string;

  /**
   * Microsoft Text-to-Speech namespace for Azure-specific features.
   * 
   * Required for using Azure Speech Service extensions like express-as,
   * backgroundaudio, and other mstts elements.
   * 
   * @defaultValue "https://www.w3.org/2001/mstts"
   * @example "https://www.w3.org/2001/mstts"
   */
  xmlnsMstts?: string;

  /**
   * Primary language/locale for the SSML document. (Required)
   * 
   * Sets the default language for all content. Can be overridden
   * using the lang element for multilingual content.
   * 
   * Format: language-REGION (e.g., en-US, es-ES, fr-FR, zh-CN)
   * 
   * @example "en-US" - English (United States)
   * @example "es-ES" - Spanish (Spain)
   * @example "fr-FR" - French (France)
   * @example "zh-CN" - Chinese (Simplified, China)
   * 
   * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support} Supported Languages
   */
  lang: string;
}

/**
 * Configuration options for voice elements.
 * 
 * Defines the voice to use for speech synthesis and optional effects
 * that can be applied to modify the voice output.
 * 
 * @example
 * ```typescript
 * const voice: VoiceOptions = {
 *   name: 'en-US-AvaNeural',
 *   effect: 'eq_telecomhp8k'  // Phone call effect
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#neural-voices} Available Neural Voices
 */
export interface VoiceOptions {
  /**
   * Voice identifier for text-to-speech synthesis. (Required)
   * 
   * Must be a valid voice name supported by the speech service.
   * Format typically: language-REGION-NameNeural
   * 
   * Common voices:
   * - English: en-US-AvaNeural, en-US-AndrewNeural, en-US-EmmaNeural
   * - Spanish: es-ES-ElviraNeural, es-ES-AlvaroNeural
   * - French: fr-FR-DeniseNeural, fr-FR-HenriNeural
   * - Multilingual: en-US-AvaMultilingualNeural, en-US-AndrewMultilingualNeural
   * 
   * @example "en-US-AvaNeural"
   * @example "en-US-AndrewMultilingualNeural"
   * @example "es-ES-ElviraNeural"
   */
  name: string;

  /**
   * Optional audio effect to apply to the voice.
   * 
   * Modifies the voice output to simulate different audio environments
   * or transmission methods.
   * 
   * Available effects:
   * - `eq_car`: Optimized for car speakers
   * - `eq_telecomhp8k`: Telephone quality (8kHz sampling)
   * - `eq_telecomhp3k`: Lower quality telephone (3kHz sampling)
   * 
   * @example "eq_telecomhp8k" - Phone call sound
   * @example "eq_car" - Car speaker optimization
   */
  effect?: string;
}

/**
 * Configuration options for background audio.
 * 
 * Defines audio that plays throughout the entire SSML document,
 * behind the spoken content. Useful for adding music or ambient sounds.
 * 
 * @example
 * ```typescript
 * const bgAudio: BackgroundAudioOptions = {
 *   src: 'https://example.com/music.mp3',
 *   volume: '0.5',      // 50% volume
 *   fadein: '3000ms',   // 3-second fade in
 *   fadeout: '2000ms'   // 2-second fade out
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-background-audio} Background Audio Documentation
 */
export interface BackgroundAudioOptions {
  /**
   * URL of the background audio file. (Required)
   * 
   * Requirements:
   * - Must be a publicly accessible HTTPS URL
   * - Supported formats: MP3, WAV, and other common audio formats
   * - File size limits depend on the service tier
   * - Audio automatically loops if shorter than speech duration
   * 
   * @example "https://example.com/background-music.mp3"
   * @example "https://cdn.example.com/sounds/ambient.wav"
   */
  src: string;

  /**
   * Volume level of the background audio.
   * 
   * Can be specified as:
   * - Decimal: "0.0" (silent) to "1.0" (full volume)
   * - Percentage: "0%" to "100%"
   * - Decibels: "+0dB", "-6dB" (negative reduces volume)
   * 
   * @defaultValue "1.0"
   * @example "0.5" - 50% volume
   * @example "30%" - 30% volume
   * @example "-6dB" - Reduce by 6 decibels
   */
  volume?: string;

  /**
   * Duration of the fade-in effect at the start.
   * 
   * Gradually increases volume from 0 to the specified volume level.
   * Specified in milliseconds (ms) or seconds (s).
   * 
   * @example "2000ms" - 2-second fade in
   * @example "3s" - 3-second fade in
   */
  fadein?: string;

  /**
   * Duration of the fade-out effect at the end.
   * 
   * Gradually decreases volume from the specified level to 0.
   * Specified in milliseconds (ms) or seconds (s).
   * 
   * @example "1500ms" - 1.5-second fade out
   * @example "2s" - 2-second fade out
   */
  fadeout?: string;
}

/**
 * Configuration options for break/pause elements.
 * 
 * Defines pauses in speech either by strength (semantic) or
 * explicit duration. If both are specified, time takes precedence.
 * 
 * @example
 * ```typescript
 * // Using strength
 * const breakByStrength: BreakOptions = {
 *   strength: 'medium'  // 750ms pause
 * };
 * 
 * // Using explicit time
 * const breakByTime: BreakOptions = {
 *   time: '500ms'
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-a-break} Break Element Documentation
 */
export interface BreakOptions {
  /**
   * Semantic strength of the pause.
   * 
   * Each strength corresponds to a typical pause duration:
   * - `x-weak`: 250ms (very short)
   * - `weak`: 500ms (short, like a comma)
   * - `medium`: 750ms (default, like a period)
   * - `strong`: 1000ms (long, like paragraph break)
   * - `x-strong`: 1250ms (very long, for emphasis)
   * 
   * Ignored if `time` is specified.
   * 
   * @example "medium"
   * @example "strong"
   */
  strength?: import('./attributes').BreakStrength;

  /**
   * Explicit duration of the pause.
   * 
   * Specified in milliseconds (ms) or seconds (s).
   * Valid range: 0-20000ms (20 seconds max)
   * Values above 20000ms are capped at 20000ms.
   * 
   * Takes precedence over `strength` if both are specified.
   * 
   * @example "500ms" - Half second
   * @example "2s" - 2 seconds
   * @example "1500ms" - 1.5 seconds
   */
  time?: string;
}

/**
 * Configuration options for silence elements.
 * 
 * Provides precise control over silence placement in speech output,
 * with options for various positions and boundary types.
 * 
 * @example
 * ```typescript
 * const silence: SilenceOptions = {
 *   type: 'Sentenceboundary',
 *   value: '500ms'  // Add 500ms between sentences
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-silence} Silence Element Documentation
 */
export interface SilenceOptions {
  /**
   * Position and type of silence to add. (Required)
   * 
   * Determines where silence is inserted:
   * - Leading types: Beginning of text
   * - Tailing types: End of text
   * - Boundary types: Between sentences or at punctuation
   * - Exact types: Replace natural silence with specified duration
   * 
   * @example "Sentenceboundary"
   * @example "Leading-exact"
   * @example "Comma-exact"
   */
  type: import('./attributes').SilenceType;

  /**
   * Duration of the silence. (Required)
   * 
   * Specified in milliseconds (ms) or seconds (s).
   * Valid range: 0-20000ms (20 seconds max)
   * 
   * For non-exact types, this is added to natural silence.
   * For exact types, this replaces natural silence.
   * 
   * @example "200ms" - 200 milliseconds
   * @example "1s" - 1 second
   * @example "500ms" - Half second
   */
  value: string;
}

/**
 * Configuration options for prosody (speech characteristics).
 * 
 * Controls various aspects of speech delivery including pitch,
 * speaking rate, volume, and intonation contours. Multiple properties
 * can be combined for complex speech modifications.
 * 
 * @example
 * ```typescript
 * // Slow, quiet speech
 * const whisper: ProsodyOptions = {
 *   rate: 'slow',
 *   volume: 'soft',
 *   pitch: 'low'
 * };
 * 
 * // Excited speech
 * const excited: ProsodyOptions = {
 *   rate: '1.2',      // 20% faster
 *   pitch: '+10%',    // 10% higher
 *   volume: 'loud'
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-prosody} Prosody Element Documentation
 */
export interface ProsodyOptions {
  /**
   * Pitch adjustment for the speech.
   * 
   * Can be specified as:
   * - Absolute frequency: "200Hz", "150Hz"
   * - Relative change: "+2st" (semitones), "+10%", "-5%"
   * - Named values: "x-low", "low", "medium", "high", "x-high"
   * 
   * @example "high" - High pitch
   * @example "+10%" - 10% higher
   * @example "200Hz" - Specific frequency
   * @example "-2st" - 2 semitones lower
   */
  pitch?: string;

  /**
   * Pitch contour changes over time.
   * 
   * Defines how pitch changes during speech using time-position pairs.
   * Format: "(time1,pitch1) (time2,pitch2) ..."
   * Time as percentage, pitch as Hz or percentage change.
   * 
   * @example "(0%,+5Hz) (50%,+10Hz) (100%,+5Hz)" - Rising intonation
   * @example "(0%,+20Hz) (100%,-10Hz)" - Falling intonation
   */
  contour?: string;

  /**
   * Pitch range variation.
   * 
   * Controls the variability of pitch (monotone vs expressive).
   * Can be relative change or named value.
   * 
   * @example "x-low" - Very monotone
   * @example "high" - Very expressive
   * @example "+10%" - 10% more variation
   */
  range?: string;

  /**
   * Speaking rate/speed.
   * 
   * Can be specified as:
   * - Multiplier: "0.5" (half speed), "2.0" (double speed)
   * - Percentage: "+10%", "-20%"
   * - Named values: "x-slow", "slow", "medium", "fast", "x-fast"
   * 
   * @example "slow" - Slow speech
   * @example "1.5" - 50% faster
   * @example "+25%" - 25% faster
   */
  rate?: string;

  /**
   * Volume level of the speech.
   * 
   * Can be specified as:
   * - Numeric: "0" to "100" (0=silent, 100=loudest)
   * - Percentage: "50%", "80%"
   * - Decibels: "+10dB", "-5dB"
   * - Named values: "silent", "x-soft", "soft", "medium", "loud", "x-loud"
   * 
   * @example "soft" - Quiet speech
   * @example "loud" - Loud speech
   * @example "50" - 50% volume
   * @example "+5dB" - 5 decibels louder
   */
  volume?: string;
}

/**
 * Configuration options for express-as elements (Azure-specific).
 * 
 * Controls emotional expression and speaking styles for neural voices
 * that support these features. Allows for nuanced emotional delivery
 * and role-playing scenarios.
 * 
 * @example
 * ```typescript
 * // Happy expression
 * const happy: ExpressAsOptions = {
 *   style: 'cheerful',
 *   styledegree: '2'  // Double intensity
 * };
 * 
 * // Child narrator
 * const childNarrator: ExpressAsOptions = {
 *   style: 'narration-relaxed',
 *   role: 'Girl'
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#express-as-element} Express-As Documentation
 */
export interface ExpressAsOptions {
  /**
   * Emotional or speaking style to apply. (Required)
   * 
   * The available styles depend on the voice being used.
   * Common categories include emotions (cheerful, sad, angry),
   * professional styles (newscast, customerservice),
   * and special effects (whispering, shouting).
   * 
   * @example "cheerful"
   * @example "newscast-formal"
   * @example "whispering"
   * 
   * @see ExpressAsStyle type for full list
   */
  style: import('./attributes').ExpressAsStyle;

  /**
   * Intensity of the style expression.
   * 
   * Controls how strongly the style is applied.
   * Range: "0.01" (minimal) to "2" (double intensity)
   * 
   * @defaultValue "1"
   * @example "0.5" - Half intensity
   * @example "1.5" - 50% more intense
   * @example "2" - Maximum intensity
   */
  styledegree?: string;

  /**
   * Age and gender role for voice modification.
   * 
   * Simulates different speaker characteristics.
   * Only supported by certain voices.
   * 
   * @example "Girl"
   * @example "OlderAdultMale"
   * @example "YoungAdultFemale"
   * 
   * @see ExpressAsRole type for full list
   */
  role?: import('./attributes').ExpressAsRole;
}

/**
 * Configuration options for say-as elements.
 * 
 * Controls interpretation and pronunciation of formatted text
 * like dates, numbers, currency, and other specialized content.
 * 
 * @example
 * ```typescript
 * // Date interpretation
 * const date: SayAsOptions = {
 *   interpretAs: 'date',
 *   format: 'ymd'  // Year-month-day
 * };
 * 
 * // Currency with detail
 * const currency: SayAsOptions = {
 *   interpretAs: 'currency',
 *   detail: 'USD'
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#say-as-element} Say-As Documentation
 */
export interface SayAsOptions {
  /**
   * How to interpret the text content. (Required)
   * 
   * Determines the pronunciation rules applied to the text.
   * Each type has specific formatting requirements.
   * 
   * @example "date" - For dates
   * @example "cardinal" - For numbers
   * @example "telephone" - For phone numbers
   * @example "currency" - For money
   * 
   * @see SayAsInterpretAs type for full list
   */
  interpretAs: import('./attributes').SayAsInterpretAs;

  /**
   * Format hint for interpretation.
   * 
   * Provides additional formatting information.
   * Available formats depend on interpretAs value:
   * 
   * For dates:
   * - "mdy": Month-day-year
   * - "dmy": Day-month-year
   * - "ymd": Year-month-day
   * - "md": Month-day
   * - "dm": Day-month
   * - "ym": Year-month
   * - "my": Month-year
   * - "d": Day only
   * - "m": Month only
   * - "y": Year only
   * 
   * For time:
   * - "hms12": 12-hour format with seconds
   * - "hms24": 24-hour format with seconds
   * 
   * @example "ymd" - For date: 2025-12-31
   * @example "hms24" - For time: 14:30:00
   */
  format?: string;

  /**
   * Additional detail for interpretation.
   * 
   * Provides extra context for certain interpretAs types:
   * - For currency: ISO currency code (USD, EUR, GBP, etc.)
   * - For other types: Additional pronunciation hints
   * 
   * @example "USD" - US Dollars
   * @example "EUR" - Euros
   * @example "JPY" - Japanese Yen
   */
  detail?: string;
}

/**
 * Configuration options for phoneme elements.
 * 
 * Provides exact phonetic pronunciation using standard phonetic
 * alphabets. Essential for proper names, technical terms, or
 * words with ambiguous pronunciation.
 * 
 * @example
 * ```typescript
 * // IPA pronunciation
 * const ipaPhoneme: PhonemeOptions = {
 *   alphabet: 'ipa',
 *   ph: 'təˈmeɪtoʊ'  // Tomato
 * };
 * 
 * // SAPI pronunciation
 * const sapiPhoneme: PhonemeOptions = {
 *   alphabet: 'sapi',
 *   ph: 't ah m ey t ow'
 * };
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#use-phonemes-to-improve-pronunciation} Phoneme Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-ssml-phonetic-sets} Phonetic Alphabets Reference
 */
export interface PhonemeOptions {
  /**
   * Phonetic alphabet used for transcription. (Required)
   * 
   * Available alphabets:
   * - `ipa`: International Phonetic Alphabet (universal standard)
   * - `sapi`: Microsoft SAPI phonemes (English-focused)
   * - `ups`: Universal Phone Set (Microsoft's unified system)
   * 
   * @example "ipa"
   * @example "sapi"
   */
  alphabet: import('./attributes').PhonemeAlphabet;

  /**
   * Phonetic transcription of the word. (Required)
   * 
   * The exact phonetic representation in the specified alphabet.
   * Must be valid according to the chosen alphabet's rules.
   * 
   * @example "ˈʃɛdjuːl" - IPA for "schedule" (British)
   * @example "s k eh jh uw l" - SAPI for "schedule" (American)
   */
  ph: string;
}
