# Time Value of Residency Calculator

An interactive financial modeling tool to compare the net worth trajectories of different medical residency paths.

## Overview

This web application provides an interactive financial model to analyze the economic impact of choosing different length residency programs. It compares:

- 3-year residency path (shorter training, earlier attending salary)
- 7-year residency path (longer training, higher attending salary)

The analysis accounts for:
- Initial medical school debt
- Interest accumulation during residency
- Salary differences during and after residency
- Living expenses

## Tech Stack

- React 19
- Vite
- Recharts (for data visualization)
- Tailwind CSS (for styling)

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Features

- **Interactive Sliders**: Adjust financial parameters in real-time
- **Dynamic Chart**: Visualize the impact of different choices
- **Key Metrics**: See break-even points, crossover points, and final net worth
- **Responsive Design**: Works on desktop and mobile devices

## Default Assumptions

The model uses these default assumptions (all adjustable):
- Initial debt: $500,000
- Resident annual salary: $60,000
- Post 3-year residency salary: $300,000
- Post 7-year residency salary: $400,000
- Annual living expenses: $50,000
- Debt interest rate: 6%

## Important Considerations

This model provides a simplified financial comparison and doesn't account for factors like:
- Taxes
- Investment returns
- Inflation
- Specialty-specific income variations
- Geographic differences
- Quality of life
- Non-monetary career satisfaction

Use this as one tool among many when making residency decisions. 