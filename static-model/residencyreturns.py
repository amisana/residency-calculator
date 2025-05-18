#!/usr/bin/env python3
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Financial assumptions
INITIAL_DEBT = 500000  # $500K initial debt
RESIDENT_SALARY = 60000  # Annual resident salary
SHORT_ATTENDING_SALARY = 300000  # Annual attending salary after short residency
LONG_ATTENDING_SALARY = 400000  # Annual attending salary after long residency
LIVING_EXPENSES = 50000  # Annual living expenses
INTEREST_RATE = 0.06  # Annual interest rate on debt

def calculate_net_worth(years, residency_length):
    """Calculate net worth over time based on residency length."""
    net_worth = [-INITIAL_DEBT]  # Start with initial debt
    
    for year in range(1, years + 1):
        prev_net_worth = net_worth[-1]
        
        # During residency
        if year <= residency_length:
            income = RESIDENT_SALARY
            # Add interest to debt portion if net worth is negative
            if prev_net_worth < 0:
                interest = prev_net_worth * INTEREST_RATE
            else:
                interest = 0
                
            new_net_worth = prev_net_worth + (income - LIVING_EXPENSES) + interest
            
        # Post residency as attending
        else:
            if residency_length == 3:
                income = SHORT_ATTENDING_SALARY
            else:  # 7-year residency
                income = LONG_ATTENDING_SALARY
                
            new_net_worth = prev_net_worth + (income - LIVING_EXPENSES)
            
        net_worth.append(new_net_worth)
        
    return net_worth

def main():
    # Calculate for 15 years from graduation
    years = 15
    short_residency = calculate_net_worth(years, 3)
    long_residency = calculate_net_worth(years, 7)
    
    # Create dataframe for table
    years_array = list(range(years + 1))
    data = {
        'Years Since Graduation': years_array,
        '3-Year Residency Net Worth': [f"${int(val/1000)}K" if abs(val) < 1000000 else f"${val/1000000:.1f}M" for val in short_residency],
        '7-Year Residency Net Worth': [f"${int(val/1000)}K" if abs(val) < 1000000 else f"${val/1000000:.1f}M" for val in long_residency]
    }
    
    df = pd.DataFrame(data)
    # Instead of using to_markdown, just print the DataFrame
    print("\nNet Worth Comparison Table:")
    print(df)
    
    # Save table to CSV
    df.to_csv('residency_comparison.csv', index=False)
    print("\nTable saved to 'residency_comparison.csv'")
    
    # Plot the results
    plt.figure(figsize=(10, 6))
    plt.plot(years_array, short_residency, label='3-Year Residency', marker='o')
    plt.plot(years_array, long_residency, label='7-Year Residency', marker='s')
    plt.axhline(y=0, color='r', linestyle='-', alpha=0.3)
    plt.xlabel('Years Since Graduation')
    plt.ylabel('Net Worth ($)')
    plt.title('Net Worth Comparison: 3-Year vs 7-Year Residency')
    plt.legend()
    plt.grid(True)
    plt.savefig('residency_returns.png')
    print("Chart saved to 'residency_returns.png'")
    plt.show()

if __name__ == "__main__":
    main()
