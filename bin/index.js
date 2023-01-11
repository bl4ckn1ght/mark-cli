#!/usr/bin/env node

import inquirer from 'inquirer'
import download from 'download-git-repo'
import ora from 'ora'
import path from 'path'
import chalk from 'chalk'
import { program } from 'commander'
// feature
// import packageJson from '../package.json' assert { type: 'json' } 
import { readFile } from 'fs/promises'
const packageJson = JSON.parse(
  await readFile(
    new URL('../package.json', import.meta.url)
  )
)


// 下载文件列表
const RepositoryList = {
  'react-ts': 'bl4ckn1ght/react-antd-ts-vite-demo',
};

// 对话列表
const PROMPT_LIST = [
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
function downloadTemplate(options) {
  return new Promise((resolve) => {
    const CURRENT_PATH = process.cwd();
    const { projectName, templateName } = options;
    const targetPath = path.resolve(CURRENT_PATH, projectName);
    const rpUrl = RepositoryList[templateName];
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
const handleDownload = async (options) => {
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
  inquirer.prompt(PROMPT_LIST).then(async (answer) => {
    console.log(answer)
    handleDownload(answer)
  })
}

const initCliOptions = () => {
  program.version(packageJson.version)

  program.option('--egg').action(() => {
    console.log('你发现了一个彩蛋')
  })

  program.command('init').description('初始化项目').action(() => {
    entry();
  })

  program.parse(process.argv)
}

initCliOptions()



// entry()