class Gobang {
  constructor() {
    this.ai = false; // 是否开启人机,ai白子
    this.gameOver = false;// 状态
    this.color = 1; // 黑子=1  白子=2
    this.pattern = []; // 存储棋盘状态数组  0=未落子 1=黑子 2=白子
    this.list1 = []; // 黑子合集
    this.list2 = []; // 白子合集（ai）
  }

  setTips(info) {
    document.getElementById("tips").innerText = info;
  }

  exchangeColor() {
    this.color = 3 - this.color;
    this.setTips(`现在轮到 ${this.color === 1 ? "黑棋" : "白棋"} 下棋`);
  }

  getCellStatus(i, j, pattern) {
    if (i < 0 || j < 0 || j >= 15 || j >= 15) return; // 边界处理
    return pattern ? pattern[Number(i) * 15 + Number(j)] : this.pattern[Number(i) * 15 + Number(j)]
  }

  setCellStatus(i, j, color, pattern) {
    if (color === 1) {
      this.list1.push([i, j])
    } else if (color === 2) {
      this.list2.push([i, j])
    }
    if (pattern) {
      pattern[Number(i) * 15 + Number(j)] = color
    } else {
      this.pattern[Number(i) * 15 + Number(j)] = color
    }
  }

  removeCell(i, j, pattern) {
    if (pattern) {
      pattern[Number(i) * 15 + Number(j)] = 0
    } else {
      this.pattern[Number(i) * 15 + Number(j)] = 0
    }
    let index_1 = this.list1.findIndex(p => p[0] === i && p[1] === j)
    if (index_1 !== -1) {
      this.list1.splice(index_1, 1)
    }
    let index_2 = this.list2.findIndex(p => p[0] === i && p[1] === j)
    if (index_2 !== -1) {
      this.list2.splice(index_2, 1)
    }
  }

  clone(pattern) {
    return Object.create(pattern)
  }

  check(i, j, color, pattern) {
    /**
     * 没必要全量检测棋盘每个点
     * 只需要检测最后落子的地方是否构成胜利条件
     * 胜利条件:
     *  最后落子在横纵斜四种方向上构成一条5个连续相同色
     */
    // debugger;
    {
      // 由落子点 横向 寻找同色棋子个数, 记为sameLength
      let sameLength = 0;
      let _j = j;
      while (_j >= 0 && this.getCellStatus(i, _j, pattern) === color && sameLength < 5) {
        sameLength++;
        _j--
      }
      if (sameLength >= 5) return true;
      _j = j + 1;
      while (_j < 15 && this.getCellStatus(i, _j, pattern) === color && sameLength < 5) {
        sameLength++;
        _j++
      }
      if (sameLength >= 5) return true;
    }
    {
      // 由落子点 纵向 寻找同色棋子个数
      let sameLength = 0;
      let _i = i;
      while (_i >= 0 && this.getCellStatus(_i, j, pattern) === color && sameLength < 5) {
        sameLength++;
        _i--
      }
      if (sameLength >= 5) return true;
      _i = i + 1;
      while (_i < 15 && this.getCellStatus(_i, j, pattern) === color && sameLength < 5) {
        sameLength++;
        _i++
      }
      if (sameLength >= 5) return true;
    }
    {
      // 由落子点 斜向 (左上到右下) 寻找同色棋子个数
      let sameLength = 0;
      let _i = i,
        _j = j;
      while (_i >= 0 && _j >= 0 && this.getCellStatus(_i, _j, pattern) === color && sameLength < 5) {
        sameLength++;
        _i--;
        _j--;
      }
      if (sameLength >= 5) return true;
      _i = i + 1;
      _j = j + 1;
      while (_i < 15 && _j < 15 && this.getCellStatus(_i, _j, pattern) === color && sameLength < 5) {
        sameLength++;
        _i++;
        _j++;
      }
      if (sameLength >= 5) return true;
    }
    {
      // 由落子点 斜向 (右上到左下) 寻找同色棋子个数
      let sameLength = 0;
      let _i = i,
        _j = j;
      while (_i < 15 && _j >= 0 && this.getCellStatus(_i, _j, pattern) === color && sameLength < 5) {
        sameLength++;
        _i++;
        _j--;
      }
      if (sameLength >= 5) return true;
      _i = i - 1;
      _j = j + 1;
      while (_i >= 0 && _j < 15 && this.getCellStatus(_i, _j, pattern) === color && sameLength < 5) {
        sameLength++;
        _i--;
        _j++;
      }
      if (sameLength >= 5) return true;
    }
    return false
  }
}
