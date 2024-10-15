cmake_minimum_required(VERSION 3.8)

project(cpp-learn)

# 指定 c 语言级别
set(CMAKE_C_STANDARD 17)
set(CMAKE_C_STANDARD_REQUIRED ON)

# 指定 c++ 语言级别
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 使用 clang
message("export CC=/usr/bin/clang")
set(CMAKE_C_COMPILER clang)

# 使用 clang++
message("export CXX=/usr/bin/clang++")
set(CMAKE_CXX_COMPILER clang++)

# 使用 ninja
message("export CMAKE_GENERATOR=Ninja")
set(CMAKE_GENERATOR Ninja)

# 设置 c 编译选项
# set(CMAKE_C_FLAGS "-Wall -O3")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -O1")

# 设置 c++ 编译选项
# set(CMAKE_CXX_FLAGS "-Wall -O3")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -O1")

# 使用 ctest
include(CTest)
find_package(GTest REQUIRED)
enable_testing()

# 使用 clang-format
#! clang-format --style=google -dump-config > ./.clang-format
find_program(CLANG_FORMAT clang-format)
if (CLANG_FORMAT)
    message(${CMAKE_SOURCE_DIR})
    add_custom_target(format ALL
            COMMAND ${CLANG_FORMAT} -i -style=google
            ${CMAKE_SOURCE_DIR}/src/*.cpp)
else ()
    message(WARNING "clang-format not found")
endif ()

# add_executable 添加可执行文件

# target_link_libraries 链接 gtest 库

# gtest_discover_test 发现 ctest

# -S ./src   指定源代码目录为 ./src 目录
# -B ./build 指定构建目录为 ./build 目录
# ! cmake -S ./src -B ./build
# ! cmake --build ./build
# ! cd ./build && ctest [TestName]
