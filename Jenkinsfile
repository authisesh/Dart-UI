pipeline{

    agent any
   environment {
        NEXUS_CREDS = credentials('nexusCredentialsId')
        NEXUS_DOCKER_REPO = '51.89.164.254:8090'
    }

    stages {
        stage("Clear Repos"){
            steps{
                sh "pwd"
                sh "rm -r -f Data-Repoter-UI"
                sh "ls -lart"
            }
        }
        stage("Checkout"){
            steps{
                sh "git clone git@github.com:cuisineje/Data-Repoter-UI.git"
                sh "ls -lart"
            }
        }
            stage("Build Docker Image"){
            steps{
                 dir("/root/.jenkins/workspace/Dart_UI/Data-Repoter-UI"){
                      sh "pwd"
                      sh "docker build -t dart-ui-image-dev ."
                      sh "docker images"
                 }

            }
        }

      stage('Docker Login') {
            steps {
                echo 'Nexus Docker Repository Login'
                script{
                    withCredentials([usernamePassword(credentialsId: 'nexusCredentialsId', usernameVariable: 'USER', passwordVariable: 'PASS' )]){
                       sh ' echo $PASS | docker login -u $USER --password-stdin $NEXUS_DOCKER_REPO'
                    }

                }
            }
        }

      stage('Docker Push') {
            steps {
                echo 'Pushing Imgaet to docker hub'
                sh 'docker push dart-ui-image-dev'
            }
        }
    }
}
