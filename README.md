# Time Value of Residency

A financial modeling tool to compare the net worth trajectories of different medical residency paths.

## Overview

This project provides a Python-based financial model to analyze the economic impact of choosing different length residency programs. It compares:

- 3-year residency path (shorter training, earlier attending salary)
- 7-year residency path (longer training, higher attending salary)

The analysis accounts for:
- Initial medical school debt
- Interest accumulation during residency
- Salary differences during and after residency
- Living expenses

## Usage

```bash
# Install dependencies
pip install -r requirements.txt

# Run the analysis
python residencyreturns.py
```

## Outputs

The script generates:
1. A printed table showing net worth at different time intervals
2. A CSV file with the detailed data (residency_comparison.csv)
3. A visualization of net worth over time (residency_returns.png)

## Assumptions

The model uses these default assumptions:
- Initial debt: $500,000
- Resident annual salary: $60,000
- Post 3-year residency salary: $300,000
- Post 7-year residency salary: $400,000
- Annual living expenses: $50,000
- Debt interest rate: 6%

You can modify these values in the script to match your specific situation. 