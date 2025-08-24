/**
 * Type definitions for SSML element attributes.
 * 
 * This module contains all the valid attribute values for SSML elements as defined
 * by the W3C SSML specification and Azure Speech Service extensions.
 * Using these types ensures type safety and prevents invalid values at compile time.
 * 
 * @module attributes
 * @see {@link https://www.w3.org/TR/speech-synthesis11/} W3C SSML 1.0 Specification
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation
 */

/**
 * Strength levels for break/pause elements.
 * 
 * Controls the relative duration of pauses in speech. Each strength level
 * corresponds to a predefined pause duration. The actual pause may vary
 * slightly based on the speech synthesis engine and surrounding context.
 * 
 * Duration mapping:
 * - `x-weak`: 250ms - Very short pause, barely noticeable
 * - `weak`: 500ms - Short pause, like a comma
 * - `medium`: 750ms - Medium pause (default), like a sentence ending
 * - `strong`: 1000ms - Long pause, like a paragraph break
 * - `x-strong`: 1250ms - Very long pause, for emphasis or section breaks
 * 
 * @example
 * ```typescript
 * // Short pause between items in a list
 * voice.text('First').break({ strength: 'weak' }).text('Second');
 * 
 * // Long pause for dramatic effect
 * voice.text('And the winner is').break({ strength: 'x-strong' }).text('Team Alpha!');
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-a-break} Break Element Documentation
 */
export type BreakStrength = 'x-weak' | 'weak' | 'medium' | 'strong' | 'x-strong';

/**
 * Types of silence insertion positions in SSML.
 * 
 * Specifies where and how to add silence in the speech output. Unlike break elements,
 * silence elements provide more precise control over placement and can work with
 * sentence boundaries and punctuation.
 * 
 * Position types:
 * - `Leading`: Adds extra silence at the beginning of text (additive)
 * - `Leading-exact`: Sets exact silence duration at the beginning (replaces natural silence)
 * - `Tailing`: Adds extra silence at the end of text (additive)
 * - `Tailing-exact`: Sets exact silence duration at the end (replaces natural silence)
 * - `Sentenceboundary`: Adds extra silence between sentences (additive)
 * - `Sentenceboundary-exact`: Sets exact silence duration between sentences (replaces natural silence)
 * - `Comma-exact`: Sets exact silence at commas (half/full-width)
 * - `Semicolon-exact`: Sets exact silence at semicolons (half/full-width)
 * - `Enumerationcomma-exact`: Sets exact silence at enumeration commas (full-width, used in CJK languages)
 * 
 * @example
 * ```typescript
 * // Add 200ms between sentences
 * voice.silence({ type: 'Sentenceboundary', value: '200ms' });
 * 
 * // Set exact 500ms pause at commas
 * voice.silence({ type: 'Comma-exact', value: '500ms' });
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-silence} Silence Element Documentation
 */
export type SilenceType = 
  | 'Leading' 
  | 'Leading-exact' 
  | 'Tailing' 
  | 'Tailing-exact'
  | 'Sentenceboundary' 
  | 'Sentenceboundary-exact'
  | 'Comma-exact' 
  | 'Semicolon-exact' 
  | 'Enumerationcomma-exact';

/**
 * Emphasis levels for the emphasis element.
 * 
 * Controls the intensity of emphasis applied to text. Emphasis affects both
 * pitch and timing to make words or phrases stand out from surrounding speech.
 * 
 * Levels:
 * - `strong`: High emphasis - significant pitch increase and slower speech
 * - `moderate`: Medium emphasis (default) - moderate pitch increase
 * - `reduced`: De-emphasis - lower pitch and faster speech, useful for parenthetical information
 * 
 * @example
 * ```typescript
 * // Strong emphasis for warnings
 * voice.emphasis('DANGER!', 'strong');
 * 
 * // Reduced emphasis for less important info
 * voice.emphasis('(optional)', 'reduced');
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-emphasis} Emphasis Element Documentation
 */
export type EmphasisLevel = 'strong' | 'moderate' | 'reduced';

/**
 * Phonetic alphabets supported for phoneme elements.
 * 
 * Specifies which phonetic alphabet to use for pronunciation guidance.
 * Different alphabets are suitable for different use cases and languages.
 * 
 * Alphabets:
 * - `ipa`: International Phonetic Alphabet - Universal standard, widely supported
 * - `sapi`: Microsoft SAPI phonemes - Microsoft-specific, good for English
 * - `ups`: Universal Phone Set - Microsoft's unified phoneme set
 * 
 * @example
 * ```typescript
 * // IPA for international use
 * voice.phoneme('schedule', { alphabet: 'ipa', ph: 'ˈʃɛdjuːl' });
 * 
 * // SAPI for Microsoft voices
 * voice.phoneme('Azure', { alphabet: 'sapi', ph: 'ae zh er' });
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#use-phonemes-to-improve-pronunciation} Phoneme Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-ssml-phonetic-sets} Phonetic Sets Reference
 */
export type PhonemeAlphabet = 'ipa' | 'sapi' | 'ups';

/**
 * Viseme types for lip-sync animation.
 * 
 * Visemes are visual representations of phonemes used for lip-sync animations
 * with avatars or animated characters. Azure-specific feature.
 * 
 * Types:
 * - `redlips_front`: Front-facing lip animation data
 * - `redlips_back`: Back-facing lip animation data
 * 
 * @example
 * ```typescript
 * // For avatar animation
 * voice.viseme('redlips_front');
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-speech-synthesis-viseme} Viseme Documentation
 */
export type VisemeType = 'redlips_front' | 'redlips_back';

/**
 * Interpretation types for the say-as element.
 * 
 * Specifies how text should be interpreted and pronounced. Essential for
 * proper pronunciation of numbers, dates, times, and other formatted text.
 * 
 * Types:
 * - `address`: Street addresses
 * - `cardinal`: Cardinal numbers (1, 2, 3)
 * - `characters`: Spell out each character
 * - `date`: Date values
 * - `digits`: Speak each digit individually
 * - `fraction`: Fractions (1/2, 3/4)
 * - `ordinal`: Ordinal numbers (1st, 2nd, 3rd)
 * - `spell-out`: Spell out the entire word
 * - `telephone`: Phone numbers
 * - `time`: Time values
 * - `name`: Personal names
 * - `currency`: Monetary amounts
 * 
 * @example
 * ```typescript
 * // Date pronunciation
 * voice.sayAs('2025-12-31', { interpretAs: 'date', format: 'ymd' });
 * 
 * // Currency with detail
 * voice.sayAs('\$42.50', { interpretAs: 'currency', detail: 'USD' });
 * 
 * // Phone number
 * voice.sayAs('1-800-555-1234', { interpretAs: 'telephone' });
 * 
 * // Ordinal number
 * voice.sayAs('3', { interpretAs: 'ordinal' }); // "third"
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#say-as-element} Say-As Documentation
 */
export type SayAsInterpretAs = 
  | 'address' 
  | 'cardinal' 
  | 'characters'
  | 'date' 
  | 'digits' 
  | 'fraction'
  | 'ordinal' 
  | 'spell-out' 
  | 'telephone'
  | 'time' 
  | 'name' 
  | 'currency';

/**
 * Expression styles for Azure neural voices.
 * 
 * Defines emotional and speaking styles available for neural voices that support
 * the express-as element. Not all voices support all styles - check voice documentation
 * for supported styles per voice.
 * 
 * Style categories:
 * 
 * **Emotions:**
 * - `affectionate`: Warm, caring tone
 * - `angry`: Angry, irritated tone
 * - `cheerful`: Happy, upbeat tone
 * - `depressed`: Sad, low-energy tone
 * - `embarrassed`: Embarrassed, hesitant tone
 * - `envious`: Jealous tone
 * - `excited`: High energy, enthusiastic
 * - `fearful`: Scared, worried tone
 * - `gentle`: Soft, gentle tone
 * - `hopeful`: Optimistic tone
 * - `sad`: Sad, sorrowful tone
 * - `terrified`: Very frightened tone
 * 
 * **Professional styles:**
 * - `advertisement_upbeat`: Energetic advertising voice
 * - `assistant`: Professional virtual assistant
 * - `customerservice`: Friendly customer service tone
 * - `newscast`: Professional news reading
 * - `newscast-casual`: Casual news presentation
 * - `newscast-formal`: Formal news presentation
 * - `narration-professional`: Professional narration
 * - `narration-relaxed`: Relaxed storytelling
 * - `documentary-narration`: Documentary style
 * 
 * **Conversational styles:**
 * - `calm`: Calm, composed tone
 * - `chat`: Casual conversation
 * - `friendly`: Friendly, warm tone
 * - `serious`: Serious, formal tone
 * - `unfriendly`: Cold, distant tone
 * 
 * **Special styles:**
 * - `empathetic`: Understanding, empathetic tone
 * - `lyrical`: Musical, poetic style
 * - `poetry-reading`: Poetry recitation style
 * - `shouting`: Loud, shouting voice
 * - `whispering`: Quiet, whispering voice
 * - `sports_commentary`: Sports announcer style
 * - `sports_commentary_excited`: Excited sports announcer
 * 
 * @example
 * ```typescript
 * // Emotional expression
 * voice.expressAs('I am so happy!', { style: 'cheerful' });
 * 
 * // Professional tone
 * voice.expressAs('Breaking news...', { style: 'newscast-formal' });
 * 
 * // With intensity control
 * voice.expressAs('This is amazing!', { 
 *   style: 'excited',
 *   styledegree: '2' // Double intensity
 * });
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#express-as-element} Express-As Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#voice-styles-and-roles} Style Support by Voice
 */
export type ExpressAsStyle = 
  | 'advertisement_upbeat'
  | 'affectionate'
  | 'angry'
  | 'assistant'
  | 'calm'
  | 'chat'
  | 'cheerful'
  | 'customerservice'
  | 'depressed'
  | 'disgruntled'
  | 'documentary-narration'
  | 'embarrassed'
  | 'empathetic'
  | 'envious'
  | 'excited'
  | 'fearful'
  | 'friendly'
  | 'gentle'
  | 'hopeful'
  | 'lyrical'
  | 'narration-professional'
  | 'narration-relaxed'
  | 'newscast'
  | 'newscast-casual'
  | 'newscast-formal'
  | 'poetry-reading'
  | 'sad'
  | 'serious'
  | 'shouting'
  | 'sports_commentary'
  | 'sports_commentary_excited'
  | 'whispering'
  | 'terrified'
  | 'unfriendly';

/**
 * Speaking roles for the express-as element.
 * 
 * Defines age and gender roles that can be applied to change the voice
 * characteristics. Used with the express-as element to simulate different
 * speakers. Only supported by certain Azure neural voices.
 * 
 * Roles by age group:
 * - `Girl`: Young female child
 * - `Boy`: Young male child
 * - `YoungAdultFemale`: Young adult woman (20s-30s)
 * - `YoungAdultMale`: Young adult man (20s-30s)
 * - `OlderAdultFemale`: Middle-aged woman (40s-50s)
 * - `OlderAdultMale`: Middle-aged man (40s-50s)
 * - `SeniorFemale`: Elderly woman (60+)
 * - `SeniorMale`: Elderly man (60+)
 * 
 * @example
 * ```typescript
 * // Child voice for storytelling
 * voice.expressAs('Once upon a time...', {
 *   style: 'narration-relaxed',
 *   role: 'Girl'
 * });
 * 
 * // Different character voices in dialogue
 * voice.expressAs('"Hello there!"', { role: 'OlderAdultMale' });
 * voice.expressAs('"Hi grandpa!"', { role: 'Boy' });
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#express-as-element} Express-As Documentation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#voice-styles-and-roles} Role Support by Voice
 */
export type ExpressAsRole = 
  | 'Girl'
  | 'Boy'
  | 'YoungAdultFemale'
  | 'YoungAdultMale'
  | 'OlderAdultFemale'
  | 'OlderAdultMale'
  | 'SeniorFemale'
  | 'SeniorMale';
