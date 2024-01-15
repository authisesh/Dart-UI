pipeline{
    
    agent any
  
    
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
        
        stage('Push Image to Nexus') {
                steps {
                      script {
                          docker.withRegistry('http://51.89.164.254:8090/', 'nexusCredentialsId') {
                                docker.image('dart-ui-image-dev').push()
                           }
                    }
               } 
          }
    }
}
