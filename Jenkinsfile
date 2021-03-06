pipeline{
    // 스테이지 별로 다른 거..
    agent any

    // triggers {
    //     pollSCM('*/3 * * * *')
    // }

    environment {
        AWS_ACCESS_KEY_ID = credentials('awsAccessKeyId')
        AWS_SECRET_ACCESS_KEY = credentials('awsSecretAccessKey')
        AWS_DEFAULT_REGION = 'ap-northeast-2'
        HOME = '.' // Avoid npm root owned
    }

    stages {
        //레포지토리를 다운로드 받음
        stage('Prepare') {
            agent any

            steps {
                echo 'Clonning Repository'
                git url: 'https://github.com/samii32/server.git',
                    branch: 'master',
                    credentialsId: 'tokenforjenkins'
            }

            post {
                // If Maven was able to run the tests, even if some of the test
                // failed, record the test results and archive the jar file.
                success {
                    echo 'Successfully Cloned Repository..'
                }
                always {
                    echo "i tried..."
                }
                cleanup {
                    echo "after all other post condition"
                }
            }
        }

        // stage('Only for production') {
        //     when {
        //         branch 'production'
        //         environment name: 'APP_ENV', value: 'prod'
        //         anyOf {
        //             environment name: 'DEPLOY_TO', value: 'production'
        //             environment name: 'DEPLOY_TO', value: 'staging'
        //         }
        //     }
        // }

        // aws s3에 파일을 올림
        stage('Deploy Frontend') {
            steps {
                echo 'Deploying Frontend'
                // 프론트엔드 디렉토리의 정적파일들을 S3 에 올림, 
                // 이 전에 반드시 EC2 instance profile을 등록해야함.
                dir ('./src'){
                    sh '''
                    aws s3 sync ./ s3://sanghyunkim
                    '''
                }
            }

            post {
                // If Maven was able to run the tests, even if some of the test
                // failed, record the test results and archive the jar file.
                success {
                    echo 'Successfully Cloned Repository..'

                    mail to: 'smile_666@naver.com',
                         subject: "Deploy Fronted Success",
                         body: "Successfully deployed fronted!"
                }
                failure {
                    echo 'I failed :('
                    mail to: 'smile_666@naver.com',
                         subject: "Failed Pipeline",
                         body: "Something is wrong with deploy frontend"
                
                }
            }
        }

        // stage('Lint Backend') {
        //     // Docker plugin and Docker Pipeline 두개를 깔아야 사용가능!
        //     agent {
        //         docker {
        //             image 'node:latest'
        //         }
        //     }

        //     steps {
        //         dir ('.'){
        //             sh '''

        //             npm install&&
        //             npx eslint ./server.js --fix
        //             '''
        //         }
        //     }
        // }

        stage('Test Backend') {
            agent any

            steps {
                echo 'Test backend'
                dir ('.') {
                    sh '''
                    /usr/bin/npm install&&
                    node test.js
                    '''
                }
            }
        }

        stage('Build Backend') {
            agent any
            steps {
                echo 'Build Backend'
                dir ('.'){
                    sh """
                        docker container prune -f
                        if [ \$(docker images | grep '<none>' | wc -l) -gt 0 ]; then 
                            docker rmi \$(docker images -a --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep '<none>' | sed -E 's/(.*) <none> <none>(.*)/\\1/') || echo 'There is Errors but..'
                        fi
                        docker build -t node:server .
                    """
                }
            }
            post {
                failure {
                    error 'This pipeline stops here...'
                }
            }
        }

        stage('Deploy Backend') {
            agent any

            steps {
                echo 'Build Backend'

                dir ('.') {
                    sh '''
                    if [ \$(docker ps -a | grep server | wc -l) -eq 1 ]; then 
                        docker rm -f server
                    fi
                    docker run -p 80:80 -p 3000:3000 -d --name server node:server
                    '''
                }
            }

            post {
                success {
                    mail to: 'smile_666@naver.com',
                         subject: "Deploy Success",
                         body: "Successfully deployed!"
                }
            }
        }
    }

}