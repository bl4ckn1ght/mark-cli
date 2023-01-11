#!/usr/bin/env node

import inquirer, { QuestionCollection } from 'inquirer'
import download from 'download-git-repo'
import ora from 'ora'
import path from 'path'

interface IPromptOption {
  projectName: string,
  templateName: string
}

// 下载文件列表
const RepositoryList = {
  'react-ts': 'bl4ckn1ght/react-antd-ts-vite-demo',
};

// 对话列表
const PROMPT_LIST: QuestionCollection = [
  {
    type: 'input',
    message: 'enter your projectName',
    name: 'projectName',
    default: 'my-app-project'
  },
  {
    type: 'list',
    message: 'choose download template',
    name: 'templateName',
    choices: ['react-ts']
  }
]

// 下载模板
function downloadTemplate(options: IPromptOption): Promise<boolean> {
  return new Promise((resolve) => {
    const CURRENT_PATH = process.cwd();
    const { projectName, templateName } = options;
    const targetPath = path.resolve(CURRENT_PATH, projectName);
    const rpUrl = (<Record<string, any>>RepositoryList)[templateName];
    download(rpUrl, targetPath, {}, (err) => {
      if (err) {
        console.log(err);
        resolve(false);
      }
      resolve(true);
    });
  });
}

// 下载事件
const handleDownload = async (options: IPromptOption) => {
  const newOra = ora('start download template').start()
  const { projectName, templateName } = options
  try {
    let downloadResult = await downloadTemplate(options)
    if(downloadResult) {
      newOra.succeed('download template success')
      newOra.info(`
      you can do this like: \r
      cd ${ projectName } \r
      yarn \r
      yarn dev`)
    }
    else {
      newOra.fail('download fail')
    }
  }
  catch (err) {
    console.log(err)
    newOra.fail('download fail')
  }
}

const entry = () => {
  inquirer.prompt<IPromptOption>(PROMPT_LIST).then(async (answer) => {
    console.log(answer)
    handleDownload(answer)
  })
}

entry()