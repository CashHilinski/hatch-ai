import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('renders app header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Insurance Claim Assistant/i);
    expect(headerElement).toBeInTheDocument();
  });
});
