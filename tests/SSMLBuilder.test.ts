import { expect, describe, test } from 'bun:test';
import { SSMLBuilder } from '../src/index';

describe('SSMLBuilder', () => {
  test('should create basic SSML document', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .text('Hello, world!')
      .build();

    expect(ssml).toContain('<speak');
    expect(ssml).toContain('version="1.0"');
    expect(ssml).toContain('xml:lang="en-US"');
    expect(ssml).toContain('<voice name="en-US-AvaNeural">');
    expect(ssml).toContain('Hello, world!');
    expect(ssml).toContain('</speak>');
  });

  test('should escape special characters', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .text('Hello & goodbye < > " \'')
      .build();

    expect(ssml).toContain('Hello &amp; goodbye &lt; &gt; &quot; &apos;');
  });

  test('should add breaks with time', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .text('Hello')
        .break('500ms')
        .text('World')
      .build();

    expect(ssml).toContain('<break time="500ms"/>');
  });

  test('should add breaks with strength', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .break({ strength: 'medium' })
      .build();

    expect(ssml).toContain('<break strength="medium"/>');
  });

  test('should add background audio', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .backgroundAudio({
        src: 'https://example.com/audio.mp3',
        volume: '0.5',
        fadein: '2000ms',
        fadeout: '1000ms'
      })
      .voice('en-US-AvaNeural')
        .text('Hello')
      .build();

    expect(ssml).toContain('<mstts:backgroundaudio');
    expect(ssml).toContain('src="https://example.com/audio.mp3"');
    expect(ssml).toContain('volume="0.5"');
    expect(ssml).toContain('fadein="2000ms"');
    expect(ssml).toContain('fadeout="1000ms"');
  });

  test('should add silence', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .silence({ type: 'Sentenceboundary', value: '500ms' })
      .build();

    expect(ssml).toContain('<mstts:silence type="Sentenceboundary" value="500ms"/>');
  });

  test('should add emphasis', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .emphasis('important', 'strong')
      .build();

    expect(ssml).toContain('<emphasis level="strong">important</emphasis>');
  });

  test('should add prosody', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .prosody('slow speech', { rate: 'slow', pitch: 'low' })
      .build();

    expect(ssml).toContain('<prosody rate="slow" pitch="low">slow speech</prosody>');
  });

  test('should add express-as', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .expressAs('I am excited!', { style: 'excited' })
      .build();

    expect(ssml).toContain('<mstts:express-as style="excited">I am excited!</mstts:express-as>');
  });

  test('should add say-as', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .sayAs('2025-08-24', { interpretAs: 'date', format: 'ymd' })
      .build();

    expect(ssml).toContain('<say-as interpret-as="date" format="ymd">2025-08-24</say-as>');
  });

  test('should add bookmark', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .bookmark('test_mark')
      .build();

    expect(ssml).toContain('<bookmark mark="test_mark"/>');
  });

  test('should handle paragraphs and sentences', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .paragraph(p => p
          .text('This is a paragraph.')
        )
        .sentence(s => s
          .text('This is a sentence.')
        )
      .build();

    expect(ssml).toContain('<p>This is a paragraph.</p>');
    expect(ssml).toContain('<s>This is a sentence.</s>');
  });

  test('should add audio element', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .audio('https://example.com/sound.mp3', 'Fallback text')
      .build();

    expect(ssml).toContain('<audio src="https://example.com/sound.mp3">Fallback text</audio>');
  });

  test('should add sub element', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .sub('W3C', 'World Wide Web Consortium')
      .build();

    expect(ssml).toContain('<sub alias="World Wide Web Consortium">W3C</sub>');
  });

  test('should add phoneme', () => {
    const ssml = new SSMLBuilder({ lang: 'en-US' })
      .voice('en-US-AvaNeural')
        .phoneme('tomato', { alphabet: 'ipa', ph: 'təˈmeɪtoʊ' })
      .build();

    expect(ssml).toContain('<phoneme alphabet="ipa" ph="təˈmeɪtoʊ">tomato</phoneme>');
  });

  test('should support multiple voices', () => {
    const builder = new SSMLBuilder({ lang: 'en-US' });
    
    builder
      .voice('en-US-AvaNeural')
        .text('First voice')
      .voice('en-US-AndrewNeural')
        .text('Second voice');
    
    const ssml = builder.build();
    
    expect(ssml).toContain('<voice name="en-US-AvaNeural">First voice</voice>');
    expect(ssml).toContain('<voice name="en-US-AndrewNeural">Second voice</voice>');
  });
});
