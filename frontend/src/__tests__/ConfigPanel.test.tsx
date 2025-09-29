import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigPanel from '../components/ConfigPanel';
import { VoiceConfig } from '../types';

const baseConfig: VoiceConfig = {
  voiceId: 'voice-1',
  speechRate: 1,
  speechPitch: 1,
  language: 'en-US',
};

describe('ConfigPanel', () => {
  beforeEach(() => {
    (window.speechSynthesis.getVoices as jest.Mock).mockReturnValue([
      { voiceURI: 'voice-1', name: 'Voice One', lang: 'en-US' } as any,
    ]);
  });

  it('toggles open and allows changing settings', async () => {
    const user = userEvent.setup();
    const onConfigChange = jest.fn();

    render(<ConfigPanel config={baseConfig} onConfigChange={onConfigChange} />);

    await user.click(screen.getByRole('button', { name: /voice settings/i }));

    const rate = screen.getByLabelText(/speech rate/i) as HTMLInputElement;
    expect(rate.value).toBe('1');

    fireEvent.change(rate, { target: { value: '2' } });
    expect(onConfigChange).toHaveBeenCalled();

    const voiceSelect = screen.getByLabelText(/voice:/i);
    await user.selectOptions(voiceSelect, 'voice-1');
    expect(onConfigChange).toHaveBeenCalledWith(expect.objectContaining({ voiceId: 'voice-1' }));
  });
});
