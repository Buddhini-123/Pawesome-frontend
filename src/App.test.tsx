import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  test('renders header navigation', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Check for navigation links
    expect(screen.getByText(/Subscription/i)).toBeInTheDocument();
    expect(screen.getByText(/Gift Box/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Deals/i)).toBeInTheDocument();
  });
});