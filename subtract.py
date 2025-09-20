def subtract_numbers(a, b):
    return a - b

if __name__ == "__main__":
    num1 = float(input("Enter the first number: "))
    num2 = float(input("Enter the second number: "))
    result = subtract_numbers(num1, num2)
    print(f"The difference is: {result}")