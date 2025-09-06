# C++

## LeetCode 1792

```cpp
#include <queue>
#include <tuple>
#include <vector>

using namespace std;

class Solution {
 public:
  double maxAverageRatio(vector<vector<int>>& classes, int extraStudents) {
    using HeapNode = tuple<double, int, int>;
    auto cmp = [](const HeapNode& a, const HeapNode& b) {
      return get<0>(a) < get<0>(b);
    };
    auto heapArr = priority_queue<HeapNode, vector<HeapNode>, decltype(cmp)>();

    for (auto& c : classes) {
      auto passNum = c[0], totalNum = c[1];
      auto gain = double((totalNum - passNum)) /
                  double((static_cast<long long>(totalNum) *
                          static_cast<long long>(totalNum + 1)));
      heapArr.emplace(tuple<double, int, int>(gain, passNum, totalNum));
    }

    for (; extraStudents > 0; extraStudents -= 1) {
      auto [_, passNum, totalNum] = heapArr.top();
      heapArr.pop();
      passNum += 1;
      totalNum += 1;
      auto gain = double((totalNum - passNum)) /
                  double((static_cast<long long>(totalNum) *
                          static_cast<long long>(totalNum + 1)));
      heapArr.emplace(gain, passNum, totalNum);
    }

    auto sum = double(0);
    while (!heapArr.empty()) {
      auto [_, passNum, totalNum] = heapArr.top();
      heapArr.pop();
      sum += double(passNum) / double(totalNum);
    }
    return sum / heapArr.size();
  }
};
```
