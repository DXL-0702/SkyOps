# SkyOps Agent 团队开发流程

本文档用于说明 SkyOps Agent 的统一开发流程。请所有成员严格按本文档操作。

我们采用：

```text
Collaborator 权限 + 功能分支 + Pull Request + DXL-0702以及ai审查 + main 分支保护
```

我们不采用 fork 流程。成员直接在原项目仓库中创建自己的功能分支，写完代码后提交 Pull Request，必须经过DXL-0702以及ai审查后才能合并。

## 1. 核心规则

### 1.1 所有人必须遵守

1. 不允许直接修改 `main` 分支。
2. 不允许直接 push 到 `main` 分支
3. 每个任务必须新建一个功能分支。
4. 每个功能分支只做一个明确任务。
5. 完成任务后必须提交 Pull Request。
6. 代码必须经过审查后才能合并。
7. 组员不能自行合并自己的 PR。
8. 不要在一个 PR 里混合多个无关修改。
9. 不要提交无关文件，例如临时文件、缓存文件、个人 IDE 配置、大型无关数据文件。
10. 如果不确定某个改动是否应该提交，先问DXL-0702。

### 1.2 分支关系

```text（这个是参考）
main
  |
  |-- feature/task-understanding
  |-- feature/mock-weather
  |-- feature/risk-rules
  |-- fix/report-format
  |-- docs/update-process
```

`main` 是稳定主分支，只有经过审查的代码才能进入。

成员开发时只能在自己的功能分支上工作。

## 2. 维护者需要完成的仓库设置

本节由DXL-0702来完成，你们只需参阅一些过程

### 2.1 添加组员为 Collaborator

在 GitHub 仓库页面中：

```text
Settings -> Collaborators and teams -> Add people
```

给成员添加权限：

```text
Role: Write
```

### 2.2 保护 main 分支

在 GitHub 仓库页面中：

```text
Settings -> Rules -> Rulesets -> New branch ruleset
```

Ruleset 名称建议：

```text
Protect main
```

Enforcement status 选择：

```text
Active
```

Target branches 选择：

```text
Default branch
```

如果仓库默认分支就是 `main`，选择 `Default branch` 即可。如果想显式锁定 `main`，也可以选择：

```text
Include by pattern -> main
```

开启：

```text
Restrict deletions
Require a pull request before merging
Required approvals: 1
Dismiss stale pull request approvals when new commits are pushed
Require conversation resolution before merging
Block force pushes
Require review from Code Owners
```

可选开启：

```text
Require approval of the most recent reviewable push
```

这个选项可以避免 PR 在最后一次 push 后没有被别人重新确认就合并。对本项目是推荐项，但不是必须项。

暂时不要开启：

```text
Restrict updates
```

新版 GitHub Rulesets 里，旧版 `Restrict who can push to matching branches` 的对应能力主要变成了 `Restrict updates` 加 bypass 权限配置。`Restrict updates` 的含义是：只有拥有 bypass 权限的人才能更新匹配分支。

本项目当前建议先不勾选 `Restrict updates`，因为：

```text
Require a pull request before merging
Require review from Code Owners
```

已经能阻止成员直接 push 到 `main`，并要求通过 PR 和维护者审查来修改 `main`。如果误开 `Restrict updates` 且没有正确配置 bypass，可能导致 PR 合并也被卡住。

如果后续需要更严格地做到“只有组长能合并 main”，再开启：

```text
Restrict updates
```

并在 bypass list 中只添加组长本人。这个设置要谨慎配置。

如果项目已经配置自动测试（这个 DXL-0702 会配置），再开启：

```text
Require status checks to pass before merging
Require branches to be up to date before merging
```

如果还没有配置 CI，不要开启 `Require status checks to pass before merging`，否则可能找不到可选择的检查项，或者导致 PR 无法合并。

### 2.3 添加 CODEOWNERS

为了确保所有 PR 都必须经过维护者审查，添加文件：

```text
.github/CODEOWNERS
```

内容：

```text
* @DXL-0702
```

添加后，回到 Ruleset 中开启：

```text
Require review from Code Owners
```

这样任何修改都会要求 Code Owner 审查。否则，仅设置 `Required approvals: 1` 时，理论上其他 collaborator 之间也可能互相批准 PR。

## 3. 成员第一次准备环境

以下步骤面向 Windows 成员，终端统一使用 `cmd`。

### 3.1 安装 Git

推荐方式一：使用 winget 安装。

打开 Windows 的 `cmd`，执行：

```cmd
winget install --id Git.Git -e --source winget
```

安装完成后关闭 `cmd`，重新打开一个新的 `cmd`。

检查 Git 是否安装成功：

```cmd
git --version
```

如果看到类似下面的输出，说明安装成功：

```text
git version 2.xx.x.windows.x
```

推荐方式二：下载安装包。

如果 `winget` 不可用，请访问：

```text
https://git-scm.com/download/win
```

下载 Git for Windows 并安装。安装时保持默认选项即可。

安装完成后重新打开 `cmd`，执行：

```cmd
git --version
```

### 3.2 配置 Git 用户信息

第一次使用 Git 需要配置姓名和邮箱。

请把下面命令中的姓名和邮箱改成自己的信息：

```cmd
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

查看是否配置成功：

```cmd
git config --global user.name
git config --global user.email
```

建议邮箱使用 GitHub 账号绑定的邮箱。

### 3.3 接受 GitHub 邀请

DXL-0702添加你为 collaborator 后，你需要在 GitHub 上接受邀请。

通常可以在以下位置看到邀请：

```text
GitHub 右上角通知
```

或邮箱中的 GitHub 邀请邮件。

未接受邀请前，你可能无法 push 分支。

## 4. 第一次克隆项目

### 4.1 选择本地存放目录

例如把项目放到桌面：

```cmd
cd Desktop
```

也可以放到自己的代码目录，例如：

```cmd
cd C:\Users\你的用户名\Desktop
```

### 4.2 克隆原项目仓库

在 GitHub 仓库页面点击：

```text
Code -> HTTPS
```

复制仓库地址：

```text
https://github.com/DXL-0702/SkyOps.git
```

在 `cmd` 中执行：

```cmd
git clone https://github.com/DXL-0702/SkyOps.git
```

进入项目目录：

```cmd
cd SkyOps
```

检查当前分支：

```cmd
git branch
```

确认能看到 `main` 分支。

### 4.3 登录 GitHub

第一次执行 `git clone` 或 `git push` 时，Git 可能会弹出 GitHub 登录窗口。

请使用自己的 GitHub 账号登录，并按提示授权。

不要使用 GitHub 密码在命令行里直接登录。GitHub HTTPS 推送通常使用浏览器授权或 token，Git for Windows 自带的 Git Credential Manager 会自动处理。

## 5. 每次开始写代码前

每次开始新任务前，都要先同步最新 `main`。

进入项目目录：

```cmd
cd C:\Users\你的用户名\Desktop\仓库名
```

切回 `main`：

```cmd
git checkout main
```

拉取最新代码：

```cmd
git pull origin main
```

确认当前工作区干净：

```cmd
git status
```

如果看到：

```text
working tree clean
```

说明可以开始新任务。

## 6. 创建自己的功能分支

每个任务必须创建一个新的功能分支。

命名规则：

```text
feature/功能名称
fix/问题名称
docs/文档名称
test/测试名称
```

示例：

```cmd
git checkout -b feature/task-understanding
```

或：

```cmd
git checkout -b feature/mock-weather
```

或：

```cmd
git checkout -b fix/risk-score
```

查看当前分支：

```cmd
git branch
```

当前分支前面会有 `*`。

确认你不在 `main` 上写代码。

## 7. 写代码过程中的常用命令

查看当前修改：

```cmd
git status
```

查看具体修改内容：

```cmd
git diff
```

把文件加入暂存区：

```cmd
git add 文件路径
```

例如：

```cmd
git add src\agents\task_understanding\parser.py
```

如果确认本次所有修改都要提交，可以使用：

```cmd
git add .
```

提交代码：

```cmd
git commit -m "实现任务理解基础解析"
```

提交信息要简洁说明本次做了什么。

推荐提交信息示例：

```text
实现任务理解基础解析
新增模拟天气数据
修复风险等级计算错误
补充异常事件测试用例
更新团队开发流程文档
```

不推荐提交信息：

```text
update
fix
改了一下
111
test
```

## 8. 推送分支到 GitHub

第一次推送新分支：

```cmd
git push -u origin 分支名
```

例如：

```cmd
git push -u origin feature/task-understanding
```

之后如果继续在同一个分支上提交，只需要：

```cmd
git push
```

推送成功后，GitHub 通常会提示创建 Pull Request。

## 9. 创建 Pull Request

在 GitHub 仓库页面中，点击：

```text
Compare & pull request
```

确认：

```text
base: main
compare: 你的功能分支
```

PR 标题建议：

```text
实现任务理解基础解析
新增模拟天气数据
修复风险等级计算错误
```

PR 描述必须写清楚：

```text
1. 本次修改了什么
2. 为什么要这样改
3. 如何测试
4. 是否有不确定的地方需要组长重点审查
```

PR 描述模板：

```md
## 本次修改

说明本 PR 做了什么。

## 对应任务

- 任务名称：
- 相关模块：

## 自测结果

说明自己运行了哪些命令，结果是什么。

## 风险说明

说明本次修改可能影响哪些地方。

## 需要组长重点审查

说明自己不确定的地方。
```

提交 PR 后，在 Reviewers 中选择DXL-0702。

## 10. PR 审查后的修改流程

如果DXL-0702提出修改意见，不要关闭 PR，也不要重新开一个 PR。

直接在原来的功能分支上继续修改。

确认当前在自己的功能分支：

```cmd
git branch
```

如果不在自己的分支，切换回去：

```cmd
git checkout feature/task-understanding
```

修改代码后：

```cmd
git status
git add .
git commit -m "根据审查意见调整任务解析逻辑"
git push
```

推送后，原 PR 会自动更新。

然后在 GitHub PR 页面或者wx群里回复DXL-0702的 review comment，说明已经修改。

## 11. 如果 main 更新了，如何同步

如果你开发期间 `main` 已经被别人更新，需要把最新 `main` 合并到自己的分支。

先保存自己的修改并提交：

```cmd
git status
git add .
git commit -m "保存当前任务进度"
```

切回 `main`：

```cmd
git checkout main
```

拉取最新 `main`：

```cmd
git pull origin main
```

切回自己的分支：

```cmd
git checkout feature/task-understanding
```

把最新 `main` 合并进来：

```cmd
git merge main
```

如果没有冲突，直接推送：

```cmd
git push
```

如果出现冲突，先不要乱改，联系组长一起处理。

## 12. 如果出现冲突

冲突通常会看到类似提示：

```text
CONFLICT
Automatic merge failed
```

查看冲突文件：

```cmd
git status
```

冲突文件中会出现类似内容：

```text
<<<<<<< HEAD
当前分支的内容
=======
main 分支的内容
>>>>>>> main
```

处理原则：

1. 不要直接删除文件。
2. 不要随便保留一边内容。
3. 先理解两边改动。
4. 不确定时立刻问DXL-0702。

解决冲突后：

```cmd
git add .
git commit -m "解决与 main 的合并冲突"
git push
```

## 13. PR 合并后，成员如何清理本地分支

DXL-0702合并 PR 后，成员本地可以删除已经完成的功能分支。

切回 `main`：

```cmd
git checkout main
```

拉取最新代码：

```cmd
git pull origin main
```

删除本地功能分支：

```cmd
git branch -d feature/task-understanding
```

如果 GitHub 上的远程分支还没有删除，可以删除远程分支：

```cmd
git push origin --delete feature/task-understanding
```

如果不确定是否应该删除远程分支，先问组长。

## 14. 常见错误和处理方式

### 14.1 不小心在 main 上写了代码

先不要 push。

查看当前修改：

```cmd
git status
```

创建新分支保存当前修改：

```cmd
git checkout -b feature/你的任务名
```

然后正常提交：

```cmd
git add .
git commit -m "你的提交说明"
git push -u origin feature/你的任务名
```

再发 PR。

### 14.2 push 被拒绝

常见原因：

```text
没有接受 collaborator 邀请
没有登录正确的 GitHub 账号
当前分支落后于远程分支
尝试 push 到 main
```

先检查当前分支：

```cmd
git branch
```

如果当前是 `main`，不要继续 push。

如果当前是自己的功能分支，可以尝试：

```cmd
git pull
git push
```

如果仍然失败，把完整报错发给DXL-0702。

### 14.3 git pull 后不知道发生了什么 （问ai）

执行：

```cmd
git status
```

把输出发给DXL-0702。（也行）

不要执行自己不理解的危险命令。

### 14.4 不要随便使用这些命令

除非DXL-0702明确要求，不要使用：

```cmd
git reset --hard
git push --force
git clean -fd
```

这些命令可能删除代码或覆盖别人的提交。

## 15. 代码提交前自查清单

提交 PR 前，请确认：

```text
[ ] 我没有在 main 分支上开发
[ ] 我的分支只做了一个明确任务
[ ] 我已经运行过项目需要的测试或检查
[ ] 我已经用 git status 检查过修改文件
[ ] 我没有提交无关文件
[ ] 我的提交信息能说明改动内容
[ ] PR 描述写清楚了修改内容、自测结果和风险
[ ] 我已经请求DXL-0702 review （一定要告诉我不管是在github上@还是群里说）
```

## 16. 推荐任务拆分方式

SkyOps Agent 项目强调模块清晰、类型明确、可测试。任务应尽量拆小。

推荐的小任务：

```text
定义 MissionTask 数据结构
定义 EnvironmentState 数据结构
新增 mock 天气数据
新增 mock 人流数据
实现风速硬约束检查
实现电量硬约束检查
实现任务解析的基础规则
实现异常事件 IncidentEvent 模型
新增风速突变测试用例
新增 PR 模板
更新 README 的运行说明
```

不推荐的大任务：

```text
一次性完成整个后端
一次性完成整个前端
一次性重构所有代码
一次性加入所有 Agent
边写任务解析边改 UI 边改测试边改文档
```

一个 PR 越小，越容易审查，也越容易合并。

## 17. 本项目的特殊要求

SkyOps Agent 的核心是低空作业任务自治与风险推演，不是传统无人机缺陷识别工具。

开发时必须注意：

1. 不要把主要功能做成裂缝识别、热斑识别或自动报告生成。
2. mock 数据必须明确标注，不能伪装成真实数据。
3. 安全规则要显式写在代码或配置里，不能只藏在 prompt 里。
4. 关键决策要保留解释字段，方便前端展示和组长审查。
5. 输出报告时要区分事实输入、模型推理、建议动作和需要人工确认的事项。
6. 涉及禁飞区、审批、人流密集、低电量、高风速等场景时，必须优先保守安全策略。

## 18. 标准工作流速查 (注意，commit描述要英文)

每次做新任务，按下面命令走：

```cmd
cd 项目所在目录
git checkout main
git pull origin main
git checkout -b feature/你的任务名
```

写代码后：

```cmd
git status
git add .
git commit -m "说明本次修改" 
git push -u origin feature/你的任务名
```

然后去 GitHub 创建 PR：

```text
base: main
compare: feature/你的任务名
reviewer: DXL-0702
```

如果组长要求修改：

```cmd
git checkout feature/你的任务名
git status
git add .
git commit -m "根据审查意见修改"
git push
```

PR 合并后：

```cmd
git checkout main
git pull origin main
git branch -d feature/你的任务名
```

## 19. 最重要的一句话

所有代码都必须经过 PR，所有 PR 都必须经过审查，任何人都不直接改 `main`。
