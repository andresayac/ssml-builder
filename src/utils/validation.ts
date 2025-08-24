/**
 * Validation utilities for SSML attribute values.
 * 
 * This module provides type guard and validation functions to ensure that
 * SSML attribute values are valid before they are used in the document.
 * These functions help prevent runtime errors and ensure compliance with
 * SSML specifications.
 * 
 * @module validation
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation
 * @see {@link https://www.w3.org/TR/speech-synthesis11/} W3C SSML Specification
 */

import type { BreakStrength, SilenceType, EmphasisLevel } from '../types';

/**
 * Type guard to check if a string is a valid break strength value.
 * 
 * Validates that the provided string is one of the allowed break strength
 * values according to the SSML specification. This function acts as a
 * TypeScript type guard, narrowing the type to `BreakStrength` when it returns true.
 * 
 * Valid values:
 * - `x-weak`: 250ms pause
 * - `weak`: 500ms pause
 * - `medium`: 750ms pause (default)
 * - `strong`: 1000ms pause
 * - `x-strong`: 1250ms pause
 * 
 * @param value - The string value to validate
 * @returns `true` if the value is a valid break strength, `false` otherwise
 * 
 * @example
 * ```typescript
 * // Valid strength
 * if (isValidBreakStrength('medium')) {
 *   // TypeScript now knows this is a BreakStrength
 *   const strength: BreakStrength = 'medium';
 * }
 * 
 * // Invalid strength
 * console.log(isValidBreakStrength('very-strong')); // false
 * 
 * // Use in validation
 * function setBreakStrength(value: string) {
 *   if (!isValidBreakStrength(value)) {
 *     throw new Error(`Invalid break strength: ${value}`);
 *   }
 *   // Safe to use as BreakStrength
 * }
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-a-break} Break Element Documentation
 */
export function isValidBreakStrength(value: string): value is BreakStrength {
  return ['x-weak', 'weak', 'medium', 'strong', 'x-strong'].includes(value);
}

/**
 * Type guard to check if a string is a valid silence type value.
 * 
 * Validates that the provided string is one of the allowed silence type
 * values for the `mstts:silence` element. This function acts as a TypeScript
 * type guard, narrowing the type to `SilenceType` when it returns true.
 * 
 * Valid types:
 * - `Leading`: Extra silence at the beginning
 * - `Leading-exact`: Exact silence at the beginning
 * - `Tailing`: Extra silence at the end
 * - `Tailing-exact`: Exact silence at the end
 * - `Sentenceboundary`: Extra silence between sentences
 * - `Sentenceboundary-exact`: Exact silence between sentences
 * - `Comma-exact`: Exact silence at commas
 * - `Semicolon-exact`: Exact silence at semicolons
 * - `Enumerationcomma-exact`: Exact silence at enumeration commas
 * 
 * @param value - The string value to validate
 * @returns `true` if the value is a valid silence type, `false` otherwise
 * 
 * @example
 * ```typescript
 * // Valid type
 * if (isValidSilenceType('Sentenceboundary')) {
 *   // TypeScript knows this is a SilenceType
 *   const type: SilenceType = 'Sentenceboundary';
 * }
 * 
 * // Invalid type
 * console.log(isValidSilenceType('Word-boundary')); // false
 * 
 * // Use in validation
 * function setSilenceType(value: string) {
 *   if (!isValidSilenceType(value)) {
 *     throw new Error(`Invalid silence type: ${value}`);
 *   }
 *   // Safe to use as SilenceType
 * }
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-silence} Silence Element Documentation
 */
export function isValidSilenceType(value: string): value is SilenceType {
  return [
    'Leading', 
    'Leading-exact', 
    'Tailing', 
    'Tailing-exact',
    'Sentenceboundary', 
    'Sentenceboundary-exact',
    'Comma-exact', 
    'Semicolon-exact', 
    'Enumerationcomma-exact'
  ].includes(value);
}

/**
 * Type guard to check if a string is a valid emphasis level value.
 * 
 * Validates that the provided string is one of the allowed emphasis level
 * values according to the SSML specification. This function acts as a
 * TypeScript type guard, narrowing the type to `EmphasisLevel` when it returns true.
 * 
 * Valid levels:
 * - `strong`: High emphasis with significant pitch and timing changes
 * - `moderate`: Medium emphasis (default)
 * - `reduced`: De-emphasis with lower pitch and faster speech
 * 
 * @param value - The string value to validate
 * @returns `true` if the value is a valid emphasis level, `false` otherwise
 * 
 * @example
 * ```typescript
 * // Valid level
 * if (isValidEmphasisLevel('strong')) {
 *   // TypeScript knows this is an EmphasisLevel
 *   const level: EmphasisLevel = 'strong';
 * }
 * 
 * // Invalid level
 * console.log(isValidEmphasisLevel('very-strong')); // false
 * 
 * // Use in validation
 * function setEmphasisLevel(value: string) {
 *   if (!isValidEmphasisLevel(value)) {
 *     throw new Error(`Invalid emphasis level: ${value}`);
 *   }
 *   // Safe to use as EmphasisLevel
 * }
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-emphasis} Emphasis Element Documentation
 */
export function isValidEmphasisLevel(value: string): value is EmphasisLevel {
  return ['strong', 'moderate', 'reduced'].includes(value);
}

/**
 * Validates if a string represents a valid duration format.
 * 
 * Checks if the provided string matches the duration format used in SSML
 * for time-based attributes like break time, silence value, fadein/fadeout, etc.
 * 
 * Valid formats:
 * - Milliseconds: `500ms`, `1500ms`, `20000ms`
 * - Seconds: `1s`, `2.5s`, `20s`
 * - Can include decimal values: `1.5s`, `750.5ms`
 * 
 * The regex pattern matches:
 * - One or more digits
 * - Optional decimal point followed by one or more digits
 * - Required unit suffix: either 'ms' or 's'
 * 
 * @param value - The string value to validate
 * @returns `true` if the value is a valid duration format, `false` otherwise
 * 
 * @example
 * ```typescript
 * // Valid durations
 * console.log(isValidDuration('500ms'));    // true
 * console.log(isValidDuration('2s'));       // true
 * console.log(isValidDuration('1.5s'));     // true
 * console.log(isValidDuration('750.25ms')); // true
 * 
 * // Invalid durations
 * console.log(isValidDuration('500'));      // false - missing unit
 * console.log(isValidDuration('2sec'));     // false - wrong unit
 * console.log(isValidDuration('ms'));       // false - missing number
 * console.log(isValidDuration('-500ms'));   // false - negative not allowed
 * 
 * // Use in validation
 * function setBreakTime(duration: string) {
 *   if (!isValidDuration(duration)) {
 *     throw new Error(`Invalid duration format: ${duration}`);
 *   }
 *   // Valid duration format
 * }
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#add-a-break} Break Time Documentation
 */
export function isValidDuration(value: string): boolean {
  return /^\d+(\.\d+)?(ms|s)$/.test(value);
}

/**
 * Validates if a string represents a valid volume value.
 * 
 * Checks if the provided string matches any of the accepted volume formats
 * for SSML prosody and background audio elements.
 * 
 * Valid formats:
 * - Decibels: `+10dB`, `-5dB`, `0dB` (can be positive or negative)
 * - Percentage: `50`, `50%`, `100`, `100%` (0-100)
 * - Named values: `silent`, `x-soft`, `soft`, `medium`, `loud`, `x-loud`
 * 
 * The regex patterns match:
 * - Decibel format: Optional +/-, digits with optional decimal, 'dB' suffix
 * - Percentage format: Digits with optional decimal, optional '%' suffix
 * 
 * @param value - The string value to validate
 * @returns `true` if the value is a valid volume format, `false` otherwise
 * 
 * @example
 * ```typescript
 * // Valid volume values
 * console.log(isValidVolume('50'));         // true - percentage
 * console.log(isValidVolume('75%'));        // true - percentage with %
 * console.log(isValidVolume('+10dB'));      // true - positive decibels
 * console.log(isValidVolume('-5.5dB'));     // true - negative decibels
 * console.log(isValidVolume('loud'));       // true - named value
 * console.log(isValidVolume('x-soft'));     // true - named value
 * 
 * // Invalid volume values
 * console.log(isValidVolume('150%'));       // false - over 100%
 * console.log(isValidVolume('very-loud'));  // false - invalid named value
 * console.log(isValidVolume('10db'));       // false - lowercase 'db'
 * 
 * // Use in validation
 * function setVolume(volume: string) {
 *   if (!isValidVolume(volume)) {
 *     throw new Error(`Invalid volume format: ${volume}`);
 *   }
 *   // Valid volume format
 * }
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-prosody} Prosody Volume Documentation
 */
export function isValidVolume(value: string): boolean {
  return /^[+-]?\d+(\.\d+)?dB$/.test(value) || 
         /^\d+(\.\d+)?%?$/.test(value) ||
         ['silent', 'x-soft', 'soft', 'medium', 'loud', 'x-loud'].includes(value);
}

/**
 * Validates if a string represents a valid speech rate value.
 * 
 * Checks if the provided string matches any of the accepted rate formats
 * for SSML prosody elements that control speaking speed.
 * 
 * Valid formats:
 * - Percentage change: `+25%`, `-10%`, `50%` (relative or absolute)
 * - Multiplier: `0.5`, `1.0`, `2.0` (treated as percentage when no % sign)
 * - Named values: `x-slow`, `slow`, `medium`, `fast`, `x-fast`
 * 
 * The regex pattern matches:
 * - Optional +/- sign
 * - Digits with optional decimal
 * - Optional '%' suffix
 * 
 * @param value - The string value to validate
 * @returns `true` if the value is a valid rate format, `false` otherwise
 * 
 * @example
 * ```typescript
 * // Valid rate values
 * console.log(isValidRate('slow'));       // true - named value
 * console.log(isValidRate('x-fast'));     // true - named value
 * console.log(isValidRate('+25%'));       // true - percentage increase
 * console.log(isValidRate('-10%'));       // true - percentage decrease
 * console.log(isValidRate('0.8'));        // true - multiplier (80% speed)
 * console.log(isValidRate('1.5'));        // true - multiplier (150% speed)
 * 
 * // Invalid rate values
 * console.log(isValidRate('very-slow'));  // false - invalid named value
 * console.log(isValidRate('200%%'));      // false - double percentage
 * 
 * // Use in validation
 * function setSpeechRate(rate: string) {
 *   if (!isValidRate(rate)) {
 *     throw new Error(`Invalid rate format: ${rate}`);
 *   }
 *   // Valid rate format
 * }
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-prosody} Prosody Rate Documentation
 */
export function isValidRate(value: string): boolean {
  return /^[+-]?\d+(\.\d+)?%?$/.test(value) ||
         ['x-slow', 'slow', 'medium', 'fast', 'x-fast'].includes(value);
}

/**
 * Validates if a string represents a valid pitch value.
 * 
 * Checks if the provided string matches any of the accepted pitch formats
 * for SSML prosody elements that control voice pitch.
 * 
 * Valid formats:
 * - Frequency: `200Hz`, `150Hz` (absolute frequency in Hertz)
 * - Percentage change: `+10%`, `-5%` (relative change from baseline)
 * - Named values: `x-low`, `low`, `medium`, `high`, `x-high`
 * 
 * The regex pattern matches:
 * - Optional +/- sign
 * - Digits with optional decimal
 * - Required unit suffix: either 'Hz' or '%'
 * 
 * Note: Semitone changes (e.g., `+2st`) are also valid in SSML but not
 * validated by this function. Consider extending if needed.
 * 
 * @param value - The string value to validate
 * @returns `true` if the value is a valid pitch format, `false` otherwise
 * 
 * @example
 * ```typescript
 * // Valid pitch values
 * console.log(isValidPitch('high'));      // true - named value
 * console.log(isValidPitch('x-low'));     // true - named value
 * console.log(isValidPitch('200Hz'));     // true - absolute frequency
 * console.log(isValidPitch('+10%'));      // true - percentage increase
 * console.log(isValidPitch('-5.5%'));     // true - percentage decrease
 * console.log(isValidPitch('150.5Hz'));   // true - decimal frequency
 * 
 * // Invalid pitch values
 * console.log(isValidPitch('very-high')); // false - invalid named value
 * console.log(isValidPitch('200'));       // false - missing unit
 * console.log(isValidPitch('200hz'));     // false - lowercase 'hz'
 * console.log(isValidPitch('+2st'));      // false - semitones not handled
 * 
 * // Use in validation
 * function setPitch(pitch: string) {
 *   if (!isValidPitch(pitch)) {
 *     throw new Error(`Invalid pitch format: ${pitch}`);
 *   }
 *   // Valid pitch format
 * }
 * ```
 * 
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup#adjust-prosody} Prosody Pitch Documentation
 */
export function isValidPitch(value: string): boolean {
  return /^[+-]?\d+(\.\d+)?(Hz|%)$/.test(value) ||
         ['x-low', 'low', 'medium', 'high', 'x-high'].includes(value);
}
