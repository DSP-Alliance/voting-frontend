export default {
  title: 'FIP 投票仪表板',
  yes: '是',
  yes2: '是 2',
  no: '否',
  abstain: '弃权',
  active: '活跃',
  passed: '通过',
  required: '必填',
  cancel: '取消',
  startVote: '开始投票',
  latestVote: '当前投票',
  voteHistory: '投票历史',
  vote: '投票',
  voteWithMultisig: '使用多重签名投票',
  noVoteData: '无投票数据',
  timeLeft: '剩余时间',
  ended: '已结束',
  authors: '作者',
  discussions: '讨论',
  winning_upper: '获胜',
  total_upper: '总计',
  question: '问题',

  buttons: {
    connect: '连接',
    disconnect: '断开连接',
    register: '注册',
    startVote: '开始投票',
    vote: '投票',
    wallet: '钱包',
  },

  labels: {
    fil: 'FIL',
    rbp: 'RBP',
    votingPower: '已注册到钱包的投票权',
  },

  modals: {
    connectors: {
      title: '连接钱包',
      optionsLabel: '选择连接方法。',
    },
    manualMinerRegister: {
      title: '手动矿工注册',
      form: {
        header:
          '您可以通过在矿工上运行命令，将矿工手动添加到已注册的选民。在此站点上注册为选民，然后将您的 ETH 钱包地址插入此表单。',
        voterAddress: {
          label: '选民地址',
          tooltip: '您注册投票的钱包地址',
        },
        minerID: {
          label: '矿工 ID',
          tooltip:
            '您的矿工 ID，不包含 ‘f’ 字符。例如，如果您的矿工 ID 是 f12345，则输入 1234。',
          invalid: '无效的矿工 ID',
        },
        closeButton: '确定',
      },
    },
    multisigRegister: {
      title: '注册多重签名',
      form: {
        header: '为了将多重签名钱包用作选民，您必须提出新交易以注册为选民。',
        subheader:
          '根据您的多重签名批准阈值，必须有 N 个 M 签署者运行批准命令。',
        step1: '1) 创建注册提案',
        step2: '2) 由签署者批准注册提案',
        multisigAddress: {
          label: '多重签名地址',
          tooltip: '输入您希望注册投票的多重签名地址',
        },
        transactionID: {
          label: '交易 ID',
          tooltip: '此将在使用提案命令并交易完成后，在 lotus cli 中显示。',
        },
        proposerAddress: {
          label: '提案人地址',
          tooltip: '代表多重签名发送提案的地址。',
        },
        closeButton: '确定',
      },
    },
    multisigVote: {
      form: {
        header:
          '在提出并批准注册交易后，提出并批准另一笔交易。使用此表单生成要包含在您的提案中的调用数据。',
        subheader:
          '一旦提议者使用上述命令创建提案，N 个 M 签署者还必须批准投票提案。',
        step1: '1) 创建投票提案',
        step2: '2) 批准投票提案',
        multisigAddress: {
          label: '多重签名地址',
        },
        transactionID: {
          label: '交易 ID',
        },
        proposerAddress: {
          label: '提案人地址',
        },
        closeButton: '确定',
      },
    },
    register: {
      buttons: {
        multisig: '注册多重签名',
        miner: '注册矿工',
        wallet: '注册钱包',
        walletWithAgent: '注册带代理的钱包',
        walletWithAgentTooltip:
          '如果您正在将您的矿工与 https://glif.io 投注，并且有代理地址，请选择此选项。',
      },
      title: '注册',
      start: {
        header:
          '请选择您希望注册的方式。如果您有Glif代理地址，您必须立即选择与代理注册钱包，否则您将无法在以后进行注册',
      },
      finished: {
        header:
          '您的钱包已注册。请确保您已连接到创建Glif代理的钱包。在下方输入您代理的ETH地址。您可以在 https://filfox.info 上查找代理地址，在“ETH地址”旁边找到。请在下面选择一个选项。',
      },
    },
    voteFactory: {
      title: '创建投票',
      form: {
        fipNumber: {
          label: 'FIP 号码',
          invalid: '输入 FIP 号码',
        },
        endDate: {
          label: '投票结束日期',
        },
        question: {
          label: '问题',
          invalid: '输入要提问的问题',
        },
        yesOptionOne: {
          invalid: '输入是选项的文本',
          label: '是选项 1',
        },
        yesOptionTwo: {
          label: '是选项 2（可选）',
        },
        lsdToken: {
          label: 'LSD 代币',
          invalid: '输入代币值',
          addButton: '添加 LSD 代币',
        },
      },
    },
    voteActions: {
      latestVoteResults: '当前投票结果',
      winningVote: '获胜的投票',
      chooseVote: '选择投票',
      registerToVote: '注册以投票',
    },
  },

  messages: {
    noVotingPower: '目前钱包中没有注册 FIL 或 RBP。',
  },
};
