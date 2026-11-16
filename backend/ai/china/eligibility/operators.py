SUPPORTED_OPERATORS={"=","!=",">","<",">=","<="}

def validate_operator(operator: str) -> bool:
    return operator in SUPPORTED_OPERATORS
