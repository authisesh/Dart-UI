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
                def dockerRunCommand = "docker run --rm -v /home/eshci/esh_projects/cypressreport:/cypress/allure-report ${NEXUS_DOCKER_REPO}dart-cypress-image-dev:24 &"
                sh dockerRunCommand

                def containerID = sh(script: dockerRunCommand, returnStdout: true).trim()

                // Extracting the container ID from the output using regular expression
                def matcher = (containerID =~ /([0-9a-f]{12})/)
                if (matcher.find()) {
                    containerID = matcher[0]
                } else {
                    error "Failed to extract the container ID"
                }
                 echo "I am here 1 ."
                 timeout(time: 1, unit: 'MINUTES') {
                  echo "I am here 2 ."
                     // Loop to continuously check the console output
                     while (true) {
                     echo "I am here 3 ."
                         // Check the console output for the specific message

                           echo "containerID : $containerID"
                          if (containerID) {
                          def consoleOutput = sh(script: "docker logs --tail 100 ${containerID}", returnStdout: true).trim()

                         if (consoleOutput.contains("Press <Ctrl+C> to exit")) {
                             echo "Found the exit message. Stopping the Docker container."
                             // Extract the container ID
                           //  def containerID = consoleOutput.substring(consoleOutput.lastIndexOf(" "), consoleOutput.lastIndexOf("."))
                             // Stop the Docker container
                             sh "docker stop ${containerID}"
                             break
                         } else {
                           echo "I am here 4 ."
                             echo "Exit message not found. Waiting for the message to appear..."
                             sleep 10 // Adjust the sleep time as needed
                         }
                         }else{
                             echo "No running container found."
                              break
                         }
                     }
                 }



            }
        }
    }
  }
}

}
