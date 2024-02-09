pipeline {
    agent any

    environment {
        NEXUS_DOCKER_REPO = '51.89.164.254:8092/repository/docker_repo_esh/'
        IMAGE_NAME = 'dart-ui-image-dev'
       // BUILD_NUMBER = '1' // Replace with the actual build number or variable
        NEXUS_CREDS = 'nexusCredentialsId'
    }

    stages {
        stage("Clear Repos and images") {
            steps {
                sh "pwd"
                sh "rm -r -f Dart-UI"
                sh "ls -lart"
                 script {
                try{
                 sh "docker stop dart-ui-image-dev"
                }catch  (Exception e) {
                      echo "Error: ${e.message}"
                    echo "No Image found"
                }
            }
            }
        }

        stage("Checkout") {
            steps {
                sh "git clone git@github.com:authisesh/Dart-UI.git"
                sh "ls -lart"
            }
        }

        stage("Build Docker Image") {
            steps {
                dir("/root/.jenkins/workspace/Dart_UI/Dart-UI") {
                    sh "pwd"
                    sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
                    sh "docker images"
                }
            }
        }

        stage('Docker Login') {
            steps {
                echo 'Nexus Docker Repository Login'
                script {
                    withCredentials([usernamePassword(credentialsId: NEXUS_CREDS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo \${PASS} | docker login -u \${USER} --password-stdin \${NEXUS_DOCKER_REPO}"
                    }
                }
            }
        }

stage('Docker Push') {
    steps {
        echo 'Pushing Image to Nexus Docker Repository'
        
        sh "docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${NEXUS_DOCKER_REPO}${IMAGE_NAME}:${BUILD_NUMBER}"
        sh "docker push ${NEXUS_DOCKER_REPO}${IMAGE_NAME}:${BUILD_NUMBER}"
      // Update the docker-compose.yml file
        // dir("/root/.jenkins/workspace/Dart_UI/Dart-UI") {
        // sh "sed -i 's|image: ${IMAGE_NAME}:.*|image: ${NEXUS_DOCKER_REPO}${IMAGE_NAME}:${BUILD_NUMBER}|' docker-compose.yml"

        // // Use Docker Compose to spin up the container
        // sh "docker-compose up -d"
        // }
    }
}

    stage('Docker Spin') {
        steps {
            echo 'Spinning Docker-Compose'
           // Update the docker-compose.yml file
            dir("/root/.jenkins/workspace/Dart_UI/Dart-UI") {
                 sh "sed -i 's|image: ${IMAGE_NAME}:.*|image: ${NEXUS_DOCKER_REPO}${IMAGE_NAME}:${BUILD_NUMBER}|' docker-compose.yml"
                  // Use Docker Compose to spin up the container
                 sh "docker-compose up -d"
            }
        }
    }

    stage('Executing Web UI Tests') {
        steps {
            echo 'Executing Web UI Tests'
              
                    build job: 'WebAutomation_SelPy_EshHome'
               
        }
    }


    }
}
