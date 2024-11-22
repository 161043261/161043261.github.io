## index

[Computer Network](./computer_network.md)

[Docker](./docker.md)

[Git](./git.md)

[Linux](./linux.md)

[MySQL](./mysql.md)

```shell
# macos
rm -rf ~/Library/Caches/*
# windows
sudo rm -rf /mnt/c/Users/admin/AppData/Local/Temp/*
sudo rm -rf /mnt/c/Users/admin/AppData/Local/Microsoft/WindowsApps/python.exe
sudo rm -rf /mnt/c/Users/admin/AppData/Local/Microsoft/WindowsApps/python3.exe
```

vscode

```sh
//(?!.*\..*\.).*\n  # //
/\*(.|\r\n|\n)*?\*/ # /**/
^\s*(?=\r?$)\n      # blank line
^(\s*)#.*           # #
```

调试 Debug

1.  继续：跳到下一个断点
2.  逐过程：逐行调试代码，遇到函数调用时，不跳入函数体内部，放行（运行函数），跳到函数调用的下一行。
3.  单步调试：逐行调试代码，遇到函数调用时，跳入函数体内部，继续逐行调试代码。
4.  单步跳出：在函数体内部时，放行（运行函数的剩余代码），跳出函数体，跳到函数调用的下一行。
