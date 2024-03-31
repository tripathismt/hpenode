import math
import matplotlib.pyplot as plt
def forward_difference_table(f_values, x_values, h):
n = len(x_values)
table = [f_values,]
for i in range(1, n):
table.append([0,]*(n-i))
for j in range(n-i):
table[i][j] = table[i-1][j+1] - table[i-1][j]
return table
def forward_difference_derivative(table, x, ind, h):
delta_sum = 0
div_fact = 1
for order in range(1,len(table)):
if len(table[order]) > ind:
delta_sum +=
((-1)**(order+1))*(table[order][ind]/div_fact)
# print(((-1)**(order+1))*div_fact,table[order][ind],
delta_sum)
div_fact += 1
return delta_sum/h
def main():
f = math.sin
x_min = 0
x_max = 1
h_values = [0.01,0.02,0.025,0.05,0.1,0.2]
absolute_error_values = []
for h in h_values:
print(f"\n\nh value = {h}")
x_values = [x_min + i * h for i in range(int((x_max -
x_min) / h) + 1)]
f_values = [f(x) for x in x_values]
table = forward_difference_table(f_values, x_values, h)
if h==0.2:
print(f"x_values = {x_values}")
print("Forward Difference Table")
for row in table:
print(row)
x = 0.2
i = x_values.index(x) # assumption that it is a point in
the inputs
derivative = forward_difference_derivative(table, x, i, h)
absolute_error_values.append(abs(derivative-math.cos(x)))
print(f"Derivative (sin(0.2)) using forward difference
table ≈ {derivative:.4f}")
print(f"Actual derivative = cos(0.2) = {math.cos(x):.4f}")
print(absolute_error_values)
plt.figure()
plt.plot(h_values,absolute_error_values)
plt.xlabel("Value of h")
plt.ylabel("Error in calculated derivative")
plt.title("Relation between h and error value")
plt.grid(True)
plt.yscale("log")
plt.show()
if __name__ == "__main__":
main()