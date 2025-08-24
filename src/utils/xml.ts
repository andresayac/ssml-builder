/**
 * XML utility functions for SSML document generation.
 * 
 * This module provides essential utilities for generating valid XML/SSML content,
 * including proper character escaping and attribute formatting. These functions
 * ensure that generated SSML documents are well-formed and safe from XML injection.
 * 
 * @module xml
 * @see {@link https://www.w3.org/TR/xml/#syntax} XML 1.0 Specification
 * @see {@link https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-synthesis-markup} Azure SSML Documentation
 */

/**
 * Escapes special XML characters in text content to ensure valid XML output.
 * 
 * This function replaces the five XML special characters with their corresponding
 * entity references to prevent XML parsing errors and potential security issues
 * like XML injection attacks. The order of replacements is critical - ampersand
 * must be replaced first to avoid double-escaping entity references.
 * 
 * The five XML entities that must be escaped are:
 * - `&` (ampersand) becomes `&amp;`
 * - `<` (less than) becomes `&lt;`
 * - `>` (greater than) becomes `&gt;`
 * - `"` (double quote) becomes `&quot;`
 * - `'` (single quote/apostrophe) becomes `&apos;`
 * 
 * This function is essential when inserting user-provided or dynamic content
 * into SSML documents to ensure the XML remains well-formed and secure.
 * 
 * @param text - The text content to escape
 * @returns The text with all XML special characters properly escaped
 * 
 * @example
 * ```typescript
 * // Basic escaping
 * escapeXml('Hello & goodbye');
 * // Returns: 'Hello &amp; goodbye'
 * 
 * // Escaping all special characters
 * escapeXml('Price < \$10 & > \$5');
 * // Returns: 'Price &lt; \$10 &amp; &gt; \$5'
 * 
 * // Escaping quotes in text
 * escapeXml('She said "Hello" and I\'m happy');
 * // Returns: 'She said &quot;Hello&quot; and I&apos;m happy'
 * 
 * // Preventing XML injection
 * escapeXml('</voice><voice name="malicious">Evil text');
 * // Returns: '&lt;/voice&gt;&lt;voice name=&quot;malicious&quot;&gt;Evil text'
 * 
 * // Safe for use in SSML
 * const userInput = 'Tom & Jerry <script>alert("XSS")</script>';
 * const safeText = escapeXml(userInput);
 * const ssml = `<speak><voice name="en-US-AvaNeural">${safeText}</voice></speak>`;
 * // Result: Valid SSML with escaped user input
 * ```
 * 
 * @see {@link https://www.w3.org/TR/xml/#dt-escape} XML Character Escaping
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html} OWASP XML Security
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')   // Must be first to avoid double-escaping
    .replace(/</g, '&lt;')     // Prevents opening unintended tags
    .replace(/>/g, '&gt;')     // Prevents closing unintended tags
    .replace(/"/g, '&quot;')   // Prevents breaking out of double-quoted attributes
    .replace(/'/g, '&apos;');  // Prevents breaking out of single-quoted attributes
}

/**
 * Formats a record of attributes into a valid XML attribute string.
 * 
 * This function takes an object containing attribute key-value pairs and
 * converts it into a properly formatted XML attribute string. It automatically:
 * - Filters out undefined values (null values should be avoided in the input)
 * - Wraps attribute values in double quotes
 * - Joins multiple attributes with spaces
 * 
 * **⚠️ Important Security Note:**
 * This function does NOT escape the attribute values. If attribute values
 * contain special characters, they should be escaped before being passed to this
 * function or the escaping should be handled at the element level. Using unescaped
 * user input as attribute values can lead to XML injection vulnerabilities.
 * 
 * @param attrs - An object containing attribute names as keys and their values as strings
 * @returns A formatted string of XML attributes ready to be inserted into an XML tag
 * 
 * @example
 * ```typescript
 * // Basic attribute formatting
 * formatAttributes({ version: '1.0', lang: 'en-US' });
 * // Returns: 'version="1.0" lang="en-US"'
 * 
 * // Filtering undefined values
 * formatAttributes({
 *   name: 'en-US-AvaNeural',
 *   effect: undefined,
 *   pitch: 'high'
 * });
 * // Returns: 'name="en-US-AvaNeural" pitch="high"'
 * 
 * // Empty object returns empty string
 * formatAttributes({});
 * // Returns: ''
 * 
 * // All undefined values
 * formatAttributes({ a: undefined, b: undefined });
 * // Returns: ''
 * 
 * // Use in XML element construction
 * const attrs = formatAttributes({
 *   version: '1.0',
 *   xmlns: 'http://www.w3.org/2001/10/synthesis',
 *   'xml:lang': 'en-US'
 * });
 * const xml = `<speak ${attrs}>content</speak>`;
 * // Result: '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">content</speak>'
 * 
 * // With SSML voice attributes
 * const voiceAttrs = formatAttributes({
 *   name: 'en-US-AvaNeural',
 *   effect: 'eq_telecomhp8k'
 * });
 * const voiceElement = `<voice ${voiceAttrs}>Hello</voice>`;
 * // Result: '<voice name="en-US-AvaNeural" effect="eq_telecomhp8k">Hello</voice>'
 * 
 * // Security consideration - escape values first if needed
 * const userProvidedName = escapeXml(getUserInput());
 * const safeAttrs = formatAttributes({
 *   name: userProvidedName  // Already escaped
 * });
 * ```
 * 
 * @remarks
 * For security reasons, always validate and escape attribute values before
 * using this function, especially when dealing with user-provided input.
 * 
 * @see {@link https://www.w3.org/TR/xml/#NT-Attribute} XML Attribute Specification
 * @see {@link escapeXml} For escaping attribute values containing special characters
 */
export function formatAttributes(attrs: Record<string, string | undefined>): string {
  return Object.entries(attrs)
    .filter(([_, value]) => value !== undefined)  // Remove undefined values
    .map(([key, value]) => `${key}="${value}"`)   // Format as key="value"
    .join(' ');                                    // Join with spaces
}
