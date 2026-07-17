import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExplanationPanel } from '../components/ExplanationPanel';

describe('ExplanationPanel Component', () => {
  it('renders idle state when no explanation is present', () => {
    render(<ExplanationPanel explanation="" isLoading={false} error={null} audioBase64={null} isAudioLoading={false} onGenerateAudio={() => {}} speaker="meera" setSpeaker={() => {}} />);
    expect(screen.getByText('Ready to Explain')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<ExplanationPanel explanation="" isLoading={true} error={null} audioBase64={null} isAudioLoading={false} onGenerateAudio={() => {}} speaker="meera" setSpeaker={() => {}} />);
    expect(screen.getByText('Analyzing code...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<ExplanationPanel explanation="" isLoading={false} error="Test Error" audioBase64={null} isAudioLoading={false} onGenerateAudio={() => {}} speaker="meera" setSpeaker={() => {}} />);
    expect(screen.getByText('Test Error')).toBeInTheDocument();
  });

  it('renders explanation text', () => {
    render(<ExplanationPanel explanation="This is a test explanation." isLoading={false} error={null} audioBase64={null} isAudioLoading={false} onGenerateAudio={() => {}} speaker="meera" setSpeaker={() => {}} />);
    expect(screen.getByText('This is a test explanation.')).toBeInTheDocument();
  });
});
