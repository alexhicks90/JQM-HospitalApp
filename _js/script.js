
$(document).on("pagebeforeshow", "#main", function() {	
	createBasePage();
	
	$("#mainContent").html("<h2>SYST 24444 Final Project</h2>" + 
		"<h4 class='underline'>Team Members</h4>" +
		"<p>Alex Hicks</p><p>Robert Skakic</p><p>Darrell Byrne</p>"
	);
});


$(document).on("pagebeforeshow", "#fitness", function() {
	createBasePage();
});

$(document).one("pagebeforeshow", "#fitness", function() {
	
	
	$.ajax({
        type:"GET", url:"XML01-fitnessdefinitions.xml", dataType:"xml",		
		success: function (xml) {
			xmlData=xml; // xmlData is equal to the xml sent from the success function
			buildMenu(xml)
		}, 
		error: function (e) {
			alert(e.status + " - " + e.statusText);
		}
    });
	
	
	function buildMenu(xml) {
		
		console.log("buildmenu");
		var i = 0;
		
		$(xml).find("label-group").each(function () {

			$("#fitnesscollapse").append("<div data-role='collapsible' data-collapsed-icon='carat-r' data-expanded-icon='carat-d'>" + 
			"<h4>" + $(this).find("label").text() + "</h4>" +
			"<div class='ui-grid-a'>" +
						"<div class='ui-block-a'>" +
							"<p><strong>Reference: </strong>" + $(this).attr("reference") + "</p>" +
							"<p><strong>Description: </strong>" + $(this).find("characterization").text() + "</p>" +
							"<a href='" + $(this).attr("reference-url") + "' class='ui-btn'>Reference Link</a>" +
						"</div>" +
						"<div class='ui-block-b imageblock'>" +
							"<img src='" + $(this).find("symbol").text() + "' height='210' width='300'>" +
						"</div>" +
					"</div>" +
					"</div>"
			);				

			i++;
		});
		
		$("#fitnesscollapse").collapsibleset("refresh");
	}
});


$(document).on("pagebeforeshow", "#hospital", function() {	
	createBasePage();	
});

$(document).one("pagebeforeshow", "#hospital", function() {
	
	// get JSON data
	$.getJSON("hospital.json", function (data) {
		console.log(data);
		
		var departments = data.hospital.departments;
		console.log(departments);
		
		start = data.hospital;
		
		// Populate Hospital info grid
		$("#hname").html("<p><span class='underline'>Name</span><br/>" + start.name + "</p>");
		$("#hcity").html("<p><span class='underline'>City</span><br/>" + start.city + "</p>");
		$("#hurl").html("<p><span class='underline'>Website Link</span><br/><a href='" + start.url + "'>Link</a></p>");
		$("#hphone").html("<p><span class='underline'>Phone</span></br>" + start.phone + "</p>");
		$("#hlongitude").html("<p><span class='underline'>Longitude</span><br/>" + start.longitude + "&deg; W</p>");
		$("#hlatitude").html("<p><span class='underline'>Latitude</span><br/>" + start.latitude + "&deg; N</p>");		
	
		
		// Populate department collapsible list
		for(var i = 0; i < departments.length; i++) {
			
			$('#' + i).remove();			
			
			$("#departmentcollapse").append("<div data-role='collapsible' id='" + i + 
				"'data-collapsed-icon='carat-r' data-expanded-icon='carat-d'>" + 
				"<h4>" + departments[i].name + "</h4>" +
				"<p><strong>Description: </strong>" + departments[i].description + "</p>" +
				"<p><strong>Fact #1: </strong>" + departments[i].fact1 + "</p>" +
				"<p><strong>Fact #2: </strong>" + departments[i].fact2 + "</p>" +
				"</div>"
			);				
		}
		
		$("#departmentcollapse").collapsibleset("refresh");	
	});
});



$(document).on("pageshow", "#map", function() {
	$.getJSON("hospital.json", function (data2) {
		
		createBasePage();
		
		start = data2.hospital;
		
		var lat = parseFloat(start.latitude);
		var lng = parseFloat(start.longitude);		
		var hospital = new google.maps.LatLng(lat, lng);
		var trafalgar = new google.maps.LatLng(43.4693, -79.69868);
		
		// set map options
		var mapOptions = {
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: hospital
		};
		
		// create map
		var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
		
		// set hospital location
		var hospitalLoc = new google.maps.Marker ({
			map : map,
			animation: google.maps.Animation.DROP,
			position: hospital
		});
		
		// set campus location
		var campusLoc = new google.maps.Marker ({
			map : map,
			animation: google.maps.Animation.DROP,
			position: trafalgar
		});		

		
		// make info window for hospital
		var hospitalwindow = new google.maps.InfoWindow ({
			content: start.name + ", " + start.city
		});
		
		// add listener for hospital window
		google.maps.event.addListener(hospitalLoc, "click", function() {
			hospitalwindow.open(map, hospitalLoc);
		});
		
		
		// make info window for campus
		campuswindow = new google.maps.InfoWindow ({
			content: "Alex Hicks<br>Robert Skakic<br>Darrell Byrne"
		});
		
		// add listener for campus window
		google.maps.event.addListener(campusLoc, "click", function() {
			campuswindow.open(map, campusLoc);
		});
		

		pathCoordinates = [{lat: 43.4693, lng: -79.69868},{lat: lat, lng: lng}];
		
		myPath = new google.maps.Polyline ({
			path: pathCoordinates,
			strokeColor: "#ff0000",
			strokeOpacity: 1.0,		
			strokeWeight: 2
		});
		
		myPath.setMap(map);		
		
	});
});

// Creates Header, navbar, footer content for all pages
function createBasePage() {
	
	// get JSON data
	$.getJSON("members.json", function (data2) {
	
		console.log(data2);		
		console.log(data2.member[0]);	
	
		// add header content to all pages
		$("header").html("<h2>Mt Sinai Hospital</h2>");
		
		//get current page
		var page = ($.mobile.activePage.attr('id'));
		console.log("Page is: " + page);
		
		// add footer content to all pages
		$("footer").html("<div class='ui-block-a'>" +
								"<a href='#" + page + "studentpopup0' data-rel='popup' id='" + page + "0' class='ui-btn' data-position-to='origin'><img src='" + data2.member[0].image + "' height='60' width='60'></a></div>" +
								"<div class='ui-block-b'>" +
								"<a href='#" + page + "studentpopup1' data-rel='popup' id='" + page + "1' class='ui-btn' data-position-to='origin'><img src='" + data2.member[1].image + "' height='60' width='60'></a></div>" +
								"<div class='ui-block-c'>" +
								"<a href='#" + page + "studentpopup2' data-rel='popup' id='" + page + "2' class='ui-btn' data-position-to='origin'><img src='" + data2.member[2].image + "' height='60' width='60'></a></div>" 
		);
		
		$("#" + page + "navbar").html("<ul>" +
								"<li><a href='#main' class='ui-btn-inline'>Home</a></li>" +
								"<li><a href='#fitness' class='ui-btn-inline'>Fitness Page</a></li>" +
								"<li><a href='#hospital' class='ui-btn-inline'>Hospital Page</a></li>" +
								"<li><a href='#map' class='ui-btn-inline'>Map Page</a></li></ul>"
		);
		
		$("#" + page + "navbar").navbar("destroy");
		$("#" + page + "navbar").navbar();
		
		/*
		// Efficient way of making popups which refuses to work
		for(var i=0; i<3; i++) {
			$("#" + page + i).click(function() {
				
				for(var j=0; j<3; j++) {
					$("#" + page + "studentpopup" + j).html("<h2>Name: " + data2.member[j].name + "</h2>" +
						"<p>Login: " + data2.member[j].login + "</p>" +		
						"<p>ID: " + data2.member[j].id + "</p>" +	
						"<img src='" + data2.member[j].image + "'>" 
					);
				}
			});
		}
		*/
	
	
		//hospital popups
		$("#hospital0").click(function() {
			$("#hospitalstudentpopup0").html("<h2>Name: " + data2.member[0].name + "</h2>" +
				"<p>Login: " + data2.member[0].login + "</p>" +		
				"<p>ID: " + data2.member[0].id + "</p>" +	
				"<img src='" + data2.member[0].image + "'>" 
			);
		});
		
		$("#hospital1").click(function() {
			$("#hospitalstudentpopup1").html("<h2>Name: " + data2.member[1].name + "</h2>" +
				"<p>Login: " + data2.member[1].login + "</p>" +		
				"<p>ID: " + data2.member[1].id + "</p>" +	
				"<img src='" + data2.member[1].image + "'>" 
			);
		});
		
		$("#hospital2").click(function() {
			$("#hospitalstudentpopup2").html("<h2>Name: " + data2.member[2].name + "</h2>" +
				"<p>Login: " + data2.member[2].login + "</p>" +		
				"<p>ID: " + data2.member[2].id + "</p>" +	
				"<img src='" + data2.member[2].image + "'>" 
			);
		});
		
		
		//fitness popups
		$("#fitness0").click(function() {
			$("#fitnessstudentpopup0").html("<h2>Name: " + data2.member[0].name + "</h2>" +
				"<p>Login: " + data2.member[0].login + "</p>" +		
				"<p>ID: " + data2.member[0].id + "</p>" +	
				"<img src='" + data2.member[0].image + "'>" 
			);
		});
		
		$("#fitness1").click(function() {
			$("#fitnessstudentpopup1").html("<h2>Name: " + data2.member[1].name + "</h2>" +
				"<p>Login: " + data2.member[1].login + "</p>" +		
				"<p>ID: " + data2.member[1].id + "</p>" +	
				"<img src='" + data2.member[1].image + "'>" 
			);
		});
		
		$("#fitness2").click(function() {
			$("#fitnessstudentpopup2").html("<h2>Name: " + data2.member[2].name + "</h2>" +
				"<p>Login: " + data2.member[2].login + "</p>" +		
				"<p>ID: " + data2.member[2].id + "</p>" +	
				"<img src='" + data2.member[2].image + "'>" 
			);
		});
		
		
		//main popups
		$("#main0").click(function() {
			$("#mainstudentpopup0").html("<h2>Name: " + data2.member[0].name + "</h2>" +
				"<p>Login: " + data2.member[0].login + "</p>" +		
				"<p>ID: " + data2.member[0].id + "</p>" +	
				"<img src='" + data2.member[0].image + "'>" 
			);
		});
		
		$("#main1").click(function() {
			$("#mainstudentpopup1").html("<h2>Name: " + data2.member[1].name + "</h2>" +
				"<p>Login: " + data2.member[1].login + "</p>" +		
				"<p>ID: " + data2.member[1].id + "</p>" +	
				"<img src='" + data2.member[1].image + "'>" 
			);
		});
		
		$("#main2").click(function() {
			$("#mainstudentpopup2").html("<h2>Name: " + data2.member[2].name + "</h2>" +
				"<p>Login: " + data2.member[2].login + "</p>" +		
				"<p>ID: " + data2.member[2].id + "</p>" +	
				"<img src='" + data2.member[2].image + "'>" 
			);
		});
	
		
		//map popups
		$("#map0").click(function() {
			$("#mapstudentpopup0").html("<h2>Name: " + data2.member[0].name + "</h2>" +
				"<p>Login: " + data2.member[0].login + "</p>" +		
				"<p>ID: " + data2.member[0].id + "</p>" +	
				"<img src='" + data2.member[0].image + "'>" 
			);
		});
		
		$("#map1").click(function() {
			$("#mapstudentpopup1").html("<h2>Name: " + data2.member[1].name + "</h2>" +
				"<p>Login: " + data2.member[1].login + "</p>" +		
				"<p>ID: " + data2.member[1].id + "</p>" +	
				"<img src='" + data2.member[1].image + "'>" 
			);
		});
		
		$("#map2").click(function() {
			$("#mapstudentpopup2").html("<h2>Name: " + data2.member[2].name + "</h2>" +
				"<p>Login: " + data2.member[2].login + "</p>" +		
				"<p>ID: " + data2.member[2].id + "</p>" +	
				"<img src='" + data2.member[2].image + "'>" 
			);
		});
	});
}


