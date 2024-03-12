angular.module('encuestaApp', [])
    .controller('EncuestaController', function ($scope, EncuestaService, $http,$location) {
        $scope.encuesta = EncuestaService.encuesta;
        $scope.step = EncuestaService.step;
        $scope.siguientePaso = function () {
            if (EncuestaService.validarPaso($scope.step)) {
                $scope.step++;

            } else {
                alert('Completa todos los campos antes de pasar al siguiente paso.');
            }
        };

        $http.post('http://localhost:8082/api/get/token?userToken=userToken')
            .then(function (tokenResponse) {
                $scope.token = tokenResponse.data.token;
                $http.get('http://localhost:8082/survey/get/musical',{
                    headers: {
                        'Authorization': 'Bearer ' + $scope.token
                    }
          })
            .then(function(response) {
                $scope.estilosMusicales = response.data;
            });
            
        });

        $scope.enviarEncuesta = function () {
            if (EncuestaService.validarPaso($scope.step)) {
                var encuestaData = {
                    emailIdentifier: $scope.encuesta.email,
                    musicId: $scope.encuesta.estiloMusical
                };
                $http.post('http://localhost:8082/survey/musical/insert', encuestaData,{
                    headers: {
                        'Authorization': 'Bearer ' + $scope.token
                    }
                })
                .then(function(response) {
                    if(response.data.code==-1){
                        alert('Email ya registrado.Favor ingresar otro.')
                    }else{
                        $scope.siguientePaso();
                    }
                })
                .catch(function(error) {
                });

            } else {
                alert('Completa todos los campos antes de enviar la encuesta.');
            }
        };

        $scope.verEncuenta= function () {
            $http.get('http://localhost:8082/survey/get/charts',{
                headers: {
                    'Authorization': 'Bearer ' + $scope.token
                }
            })
      .then(function (response) {
        $scope.siguientePaso();
        var chartData = response.data;
        //primer grafico
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(item => item.musicalDescription),
                datasets: [{
                    label: 'Cantidad',
                    data: chartData.map(item => item.amount),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', 
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: false, 
                maintainAspectRatio: false,
                width: 200, 
                height: 200
            }
        
        });
        var ctx2 = document.getElementById('myChart2').getContext('2d');
        var myChart2 = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: chartData.map(item => item.musicalDescription),
                datasets: [{
                    label: 'Cantidad',
                    data: chartData.map(item => item.amount),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', 
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: false, 
                maintainAspectRatio: false,
                width: 200, 
                height: 200
            }
        
        });

        
    });
        }
    })
    .factory('EncuestaService', function () {
        var service = {
            encuesta: {},
            step: 1,
            validarPaso: function (step) {
                if (step === 1) {
                    return true;
                }
                if (step === 2 && service.encuesta && service.encuesta.email && service.encuesta.estiloMusical) {
                    return true;
                }
                if (step === 3) {
                    return true;
                }
                if (step === 4) {
                    return true;
                }
                return false;
            },
            enviarEncuesta: function () {
            }
        };
        return service;
    });