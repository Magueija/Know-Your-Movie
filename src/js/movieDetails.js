$(document).ready(function () {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let movieId = url.searchParams.get("id");

    let langId;

    $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + movieId,
        type: "GET",
        dataType: "JSON",
        data: {
            api_key: "be1c7d906e6044e5a018be83a577eafb",
            language: "pt-PT",
            movie_id: movieId
        },
        success: function (request) {
            let movie = request;
            //console.log(movie);

            if(movie.original_title != ""){
                $('#originalTitle').text(movie.original_title);
                $(document).prop('title', movie.original_title);
            }

            if(movie.poster_path != null){
                $('#tumbnail').attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path);
            }

            if(movie.title != "" && movie.release_date != ""){
                let forYear = new Date(movie.release_date);
                $('#title').text(movie.title + " (" + forYear.getFullYear() + ")");
            }
            else if(movie.title != ""){
                $('#title').text(movie.title);
            }

            if (movie.tagline != "") {
                $('#slogan').text("- " + movie.tagline);
            }

            if(movie.vote_average != ""){
                let listaRating = $('#ratingList');

                let decimal = movie.vote_average % 1;
                let maxValue = 10;
                let rate = movie.vote_average - decimal;
                let diference = maxValue - rate;
                //console.log(decimal);
                //console.log(maxValue);
                //console.log(rate);
                //console.log(diference);

                if(decimal < 0.5){
                    for(let i=0; i < rate; i++){
                        $("<li>").append('<i class="fas fa-star"></i>').appendTo(listaRating);
                    }

                    for(let i=0; i < diference; i++){
                        $("<li>").append('<i class="far fa-star"></i>').appendTo(listaRating);
                    }
                }
                else if(decimal == 0.5){
                    for(let i=0; i < rate; i++){
                        $("<li>").append('<i class="fas fa-star"></i>').appendTo(listaRating);
                    }

                    $("<li>").append('<i class="fas fa-star-half-alt"></i>').appendTo(listaRating);

                    for(let i=0; i < diference - 1; i++){
                        $("<li>").append('<i class="far fa-star"></i>').appendTo(listaRating);
                    }
                }
                else if(decimal > 0.5){
                    for(let i=0; i < rate + 1; i++){
                        $("<li>").append('<i class="fas fa-star"></i>').appendTo(listaRating);
                    }

                    for(let i=0; i < diference - 1; i++){
                        $("<li>").append('<i class="far fa-star"></i>').appendTo(listaRating);
                    }
                }
            }
            else{
                $('.rating').css("visibility", "hidden");
            }

            if(movie.genres != ""){
                let span = $('#genres');
                let genres = movie.genres;
                for (let i = 0; i < genres.length; i++) {
                    if (genres[i].id != null) {
                        if(i == 0){
                            span.text(genres[i].name);
                        } else{
                            span.text(span.text() + ", " + genres[i].name);
                        }
                    }
                }
            }

            if(movie.belongs_to_collection != null){
                $('#collection').text(movie.belongs_to_collection.name);
            }

            if(movie.release_date != ""){
                let LDate = formatDate(movie.release_date);
                $('#lDate').text(LDate);
            }

            if(movie.spoken_languages != null){
                let span = $('#spokenLanguage');
                let spokenLanguage = movie.spoken_languages;
                for (let i = 0; i < spokenLanguage.length; i++) {
                    if (spokenLanguage[i].name != null) {
                        if(i == 0){
                            span.text(spokenLanguage[i].name);
                        } else{
                            span.text(span.text() + ", " + spokenLanguage[i].name);
                        }
                    }
                }
            }

            if(movie.overview != ""){
                $('#overview').text(movie.overview);
            }
            else {
                $('#overview').text('Sem informação.');
            }

            if(movie.production_companies != ""){
                let prodution = movie.production_companies;
                for (let i = 0; i < prodution.length; i++) {
                    if (prodution[i].id != null) {
                        if (prodution[i].logo_path != null) {
                            produtionImg("https://image.tmdb.org/t/p/w185" + prodution[i].logo_path, prodution[i].name);
                        } else {
                            produtionImg("../img/noImage-small.png", prodution[i].name);
                        }
                    }
                }
            }
            else{
                $('.produtions').css("display", "none");
            }

            if(movie.homepage != ""){
                $('.btn-website').attr("href", movie.homepage);
            }
            else{
                $('#webSite').css("display", "none");
            }
        },
        error: function (error) {
            alert("Erro " + error.status + ": " + error.responseJSON.status_message);
            window.location.href="index.html";
        }
    });

    $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + movieId + "/videos",
        type: "GET",
        dataType: "JSON",
        data: {
            api_key: "be1c7d906e6044e5a018be83a577eafb",
            language: "pt-PT"
        },
        success: function (request) {
            let listaTrailers = $("#trailers");
            let videos = request.results;
            //console.log(videos);

            if(videos.length > 0){
                for (let i = 0; i < videos.length; i++) {
                    if (videos[i].site == "YouTube" && videos[i].type == "Trailer" && videos[i].key != "") {
                        let iframe = $('<iframe src="https://www.youtube.com/embed/' + videos[i].key + '" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>"');
                        $("<li>").append(iframe).appendTo(listaTrailers);
                    }
                }
            }
            else{
                $('.trailers').css("display", "none");
            }
        },
        error: function (error) {
            alert("Erro " + error.status + ": " + error.responseJSON.status_message);
        }
    });

    $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + movieId + "/recommendations",
        type: "GET",
        dataType: "JSON",
        data: {
            api_key: "be1c7d906e6044e5a018be83a577eafb",
            language: "pt-PT"
        },
        success: function (request) {
            let recommendations = request.results;
            let listaRecommendations = $('#recomendationsList');
            //console.log(recommendations);

            if(recommendations.length > 0){
                for (let i = 0; i < recommendations.length; i++) {
                    let img;
                    if(recommendations[i].backdrop_path != null){
                       img = $("<img>").attr("src", "https://image.tmdb.org/t/p/w500" + recommendations[i].backdrop_path);
                    }
                    else if(recommendations[i].poster_path != null){
                       img = $("<img>").attr("src", "https://image.tmdb.org/t/p/w500" + recommendations[i].poster_path);
                    }
                    else{
                       img = $("<img>").attr("src", "../img/noImage-small.png");
                    }

                    let link = $("<a>").attr("href", "movieDetails.html?id=" + recommendations[i].id);
                    let titulo = $("<legend>").text(recommendations[i].title);
                    $("<li>").append(link.append(img).append(titulo)).appendTo(listaRecommendations);
                }
            }
            else{
                $('.recomendations').css("display", "none");
            }
        },
        error: function (error) {
            alert("Erro " + error.status + ": " + error.responseJSON.status_message);
        }
    });


    let listaProdutions = $("#produtions");

    function produtionImg(url, title) {
        let img = $("<img>").attr("src", url);
        let nome = $("<legend>").text(title);
        $("<li>").append($("<figure>").append(img).append(nome)).appendTo(listaProdutions);
    }

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }


    //===========
    //Back to top
    let btn = $('.backtoTop');
    $(window).scroll(function () {
        if ($(window).scrollTop() > 150) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });
    btn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    //===========
    //Back to top
    setTimeout(function () {
        $("#advice").fadeIn(200);
    }, 2000);
    $(".adviceOK").click(function() {
        $("#advice").fadeOut(200);
    });
});
