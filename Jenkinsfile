pipeline {
    agent any

    environment {
        NEXUS_DOCKER_REPO = '51.89.164.254:8092/repository/docker_repo_esh/'
        IMAGE_NAME = 'dart-ui-image-dev'
        // Ensure BUILD_NUMBER is defined or replaced with an actual build number
        // BUILD_NUMBER = '1'
        NEXUS_CREDS = 'nexusCredentialsId'

     }

    stages {

    stage('Print JAVA_HOME') {
        steps {
            sh 'echo $JAVA_HOME'
        }
    }
        stage("Clear Repos and images") {
            steps {
                // Add appropriate error handling
                script {
                    sh "pwd"
                    sh "rm -r -f Dart-UI"
                    sh "ls -lart"
                    try {
                        sh "docker stop dart-ui-image-dev"
                    } catch (Exception e) {
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
            }
        }

        stage('Spin Docker Container') {
            steps {
                echo 'Spinning Docker Container'
                dir("/root/.jenkins/workspace/Dart_UI/Dart-UI") {
                    sh "sed -i 's|image: ${IMAGE_NAME}:.*|image: ${NEXUS_DOCKER_REPO}${IMAGE_NAME}:${BUILD_NUMBER}|' docker-compose.yml"
                    sh "docker-compose up -d"
                }
            }
        }

   stage('Cypress Web UI Tests') {
    steps {
        echo 'Executing Cypress Web UI Tests'
        script {
            withCredentials([usernamePassword(credentialsId: NEXUS_CREDS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                sh "echo ${PASS} | docker login -u ${USER} --password-stdin ${NEXUS_DOCKER_REPO}"
                sh "docker ps -q --filter ancestor=${NEXUS_DOCKER_REPO}dart-cypress-image-dev:24 | xargs docker stop || true"
                sh "docker pull ${NEXUS_DOCKER_REPO}dart-cypress-image-dev:24"
                sh "docker run -p 8083:43136 --rm ${NEXUS_DOCKER_REPO}dart-cypress-image-dev:24 &"
               sh "docker run --rm -v /home/eshci/esh_projects/cypressreport:/app/allure-results ${NEXUS_DOCKER_REPO}dart-cypress-image-dev:24"
               sh "docker run --rm -v /home/eshci/esh_projects/cypressreport:/app/allure-results allure generate /app/allure-results -o /app/allure-report"
               // Add command to stop the container after 10 seconds
               sh "sleep 10 && docker stop \$(docker ps -q)"

            }
        }
    }
  }
}
    post {
        always {
            archiveArtifacts 'allure-report/**'
        }

    }
}
