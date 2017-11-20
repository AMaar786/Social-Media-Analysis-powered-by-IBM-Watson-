function createD3PieChart(jsonDataString, parentId, chartWidth, chartHeight, showLabels, showLegend, showTooltips, radious, attr,legendVerticalValue) {
    
    var w = $('#'+parentId).closest('div').width();//chartWidth, //width
        h = $('#'+parentId).closest('div').height();//chartHeight, //height

        $('#'+parentId).width(w);
        $('#'+parentId).height(h);
        r = Math.min(w, h) * 0.50, //radiuss
        badge_size = 22;
        legend_box = 12;
        legend_y = 8;
        legend_x = -85;
        legend_dy = '0.30em';
        outer_radius = 70;
        inner_radius = 25;
        font_size = '12px';
        zLevel = 0;
        color = d3.scale.ordinal()
                .domain([])
                .range(colorbrewer.wvajsPallete[1]);//d3.scale.category20(); //builtin range of colors
    if(w * 0.5 <= 1.2 * r){
      r = r * 0.70;
      badge_size = 18;
      legend_box = 12;
      outer_radius = 60;
      legend_y = 9;
      legend_dy = '0.0em';
      legend_x = -85;
      font_size = '10px';
      zLevel = 2;

    }else
    if(w * 0.45 <= 1.4 * r){
      r = r * 0.78;
      badge_size = 22;
      legend_box = 10;
      legend_y = 9;
      legend_dy = '0.0em';
      legend_x = -85;
      font_size = '12px';
      outer_radius = 65;
      zLevel = 1;
    }

    if(jsonDataString == ''){
      d3.select("#" + parentId)
        .append('text')
        .style('font-family','Lato')
        .attr('font-size',16)
        .attr("transform", "translate("+w*0.5+","+h*0.5+")")
        .style('fill','#b9b9b9')
        .style('text-anchor', 'middle')
        .text(function(d) {return 'There is no data available' });  
      return false;
    }

    var icon = '\ue004';
    if(attr != ''){
      var attrArray = JSON.parse(attr);
      if(attrArray.icon != undefined || attrArray.icon != ''){
        icon = attrArray.icon;
      }
      
    }



    data = jsonDataString;
    var SEGMENT = "label";
    var DATA = "value";

    var tooltip = d3.select("body")
                  .append("div")
                  .attr('class','probe')
                  .style("position", "absolute")
                  .style("z-index", "10")
                  .style("visibility", "hidden");

    var vis = d3.select("#" + parentId)
                //.append("svg:svg") //create the SVG element inside the <body>
                .data([data]) //associate our data with the document
                //.attr("width", w) //set the width and height of our visualization (these will be attributes of the <svg> tag
                //.attr("height", h)
                .append("svg:g") //make a group to hold our pie chart
                .attr("class", "d3-piechart-"+parentId)
                .attr("transform", "translate(" + ((w - r)+ 8 ) + "," + ((h * 0.5)-15) + ")") //move the center of the pie chart from 0, 0 to radius, radius



    var arc = d3.svg.arc()
                .innerRadius(25)
                .outerRadius(r - inner_radius);

    var pie = d3.layout.pie() //this will create arc data for us given a list of values
                .value(function (d) {
                    return d.value;
                }); //we must tell it out to access the value of each element in our data array
   
   

   var count = 0;
    var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
                  .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
                  .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                  .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                  .attr("class", "slice")
                  .on('mouseover',function(d,i){
                    return tooltip.text(d.data.key +' ('+d.data.value+')').style("visibility", "visible");
                  })
                  .on("mousemove", function(){
                    return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                  })
                  .on("mouseout", function(){
                    return tooltip.style("visibility", "hidden");
                  }); //allow us to style things in the slices (like text)
    
    var textTop = vis.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textTop")
        .text("")
        .attr("y", -10),
        textBottom = vis.append("text")
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .attr("class", "textBottom")
            .text("")
            .attr("y", 10);
    var arcOver = d3.svg.arc()
        .innerRadius(r - 20)
        .outerRadius(r - 50);
    arcs.append("svg:path")
        .attr("fill", function (d, i) {
            return color(i); 
            return color(d.data[SEGMENT]);
        }) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function
   /* arcs.on("mouseover", function (d) {  // add tooltips
        d3.select(this).select("path").transition()
            .duration(100)
            .attr("d", arc);

        textTop.text(d3.select(this).datum().data.label);
        textBottom.text(d3.select(this).datum().data.value);
    })
        .on("mouseout", function (d) {
            d3.select(this).select("path").transition()
                .duration(100)
                .attr("d", arc);

            textTop.text("");
            textBottom.text("");
        });*/

    arcs.append("svg:text") //add a label to each slice
    .attr("transform", function (d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")"; //this gives us a pair of coordinates like [50, 50]
    })
        .attr("text-anchor", "middle") //center the text on it's origin
    .text(function (d, i) {
        return '';//data[i].value;
    }); //get the label from our original data array

    var toptenRecords = data.slice(0,10);
    var legend = d3.select("#" + parentId).selectAll(".legend")
        .data(toptenRecords).enter()
        .append("g").attr("class", "legend d3-legend-text-"+parentId)
        .attr("legend-id", function (d) {
            return count++;
        })
        .attr("transform", function (d, i) {
            return "translate(100," + (legendVerticalValue + i * 20) + ")";
        })
        .on("click", function () {
            var arc = d3.select("#arc-" + $(this).attr("legend-id"));
            arc.style("opacity", 0.3);
            setTimeout(function () {
                arc.style("opacity", 1);
            }, 1000);
        });

    legend.append("rect")
        .attr("x", -100)
        .attr("width", legend_box).attr("height", legend_box)
        .style("fill", function (d,i) {
            return color(i);
            return color(d[SEGMENT]);
        });
    legend.append("text").attr("x", legend_x)
        .attr("y", legend_y).attr("dy", legend_dy)
        .style("text-anchor", "start").style('font-size',font_size).style('font-weight','300')
        .attr('fill','#525252')
        .text(function (d) {
              if(zLevel == 0){
                if(d[SEGMENT].length > 22){
                  return d[SEGMENT].substring(0,22) + '...' + ' ('+d.value+')';
                }
              }
              else if(zLevel == 2){
  
                if(d[SEGMENT].length > 10){
                  return d[SEGMENT].substring(0,10) + '...'+ ' ('+d.value+')';
                }
              }
              else if(zLevel == 1){
  
                if(d[SEGMENT].length > 13){
                  return d[SEGMENT].substring(0,13) + '...'+ ' ('+d.value+')';
                }
              }
              return d[SEGMENT] + ' ('+d.value+')';
        });


}

function barChartByValue(jsonDataString,parentId,chartWidth,chartHeight,sort){
  var margin = {top: 0, right: 10, bottom: 20, left: 10},
      width = $('#'+parentId).width();
      height = 220;
      
  var color = function(id) { 
            id = id%9;    
            return colorbrewer.wvajsPallete[7][id];
      }; 
   /*var color = d3.scale.ordinal()
                .domain([])
                .range(colorbrewer.wvajsPallete[1]);*/     

  var index = d3.range(5),
      dataMaster = jsonDataString;

   var data = dataMaster.slice(0,12);


  var x = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.value; })])
      .range([0, width - 155]);

  var y = d3.scale.ordinal()
      .domain(data.map(function(d) { 
          if(typeof(d.key) != 'undefined'){
              return d.key;
          }else if(typeof(d.label) != 'undefined'){
            return d.label;
          }

      }))
      .rangeRoundBands([0, height], .15);    

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("right");

  var svg = d3.select("#"+parentId).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr('width', (width - 60))
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  /******** for sorting the bars at user end. *uncomment if required*/
  if(sort == 'true')
  data.sort(function(a, b){ return d3.descending(a.value, b.value); });    
  /****************/
  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(90," + y(i) + ")"; });

  bar.append("rect")
      .attr("height", y.rangeBand())
      .attr("width", function(d) { return x(d.value); })
      .attr('fill', function(d,i){ return color(i);})
      .on('mouseover',function(d,event){
        return tooltip.text(d.label).style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      });  

  var labels = svg.select("g.bar")
      .append("svg:text")
          .attr("class", "label")
          .attr("x", 0)
          .attr("text-anchor", "right")
          .attr("transform", "rotate(270)")
          .attr("y", 40)
      .attr("x", -55)
          .attr("dy", ".71em")
          .text("")
          .style({"text-anchor":"end","font-size":"0.667em","fill":"#939597"});

  labels = svg.selectAll("g.bar")
      .append("svg:text")
      .attr("class", "value")
      .attr("fill","#707070")
      .attr("font-size","11px")
      .attr('font-family','sans-serif')
      .attr("x", function(d){ return -100; })
      .attr("text-anchor", "start")
      .text(function(d)
      {
        if(d.label.length > 12 && width < 330){
          return d.label.substr(0,9) + '...';;
        }
        else if(d.label.length > 15){
          return d.label.substr(0,15) + '...';;
        }

        return d.label;
      })
      .on('mouseover',function(d,event){
        return tooltip.text(d.label).style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      });

  if(dataMaster.length > 10){

      $('#'+parentId).closest('.insight-box').append('<div class="iconContainer" data-trigger="focus" id="'+parentId+'_icon"><i class="icon-list"></i> </div>');
      $('#'+parentId+'_icon').on('click', function(){
            var pop = $(this).popover({
              html : true,
              placement: function (tip, element) {
                    var offset = $(element).offset();
                    height = $(document).outerHeight();
                    width = $(document).outerWidth();
                    vert = 0.5 * height - offset.top;
                    vertPlacement = vert > 0 ? 'bottom' : 'top';
                    horiz = 0.5 * width - offset.left;
                    horizPlacement = horiz > 0 ? 'right' : 'left';
                    placement = Math.abs(horiz) > Math.abs(vert) ?  horizPlacement : vertPlacement;
                    return placement;
              },
              
              trigger: 'manual',
              container: 'body',
              template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><a href="javascript:///0;" class="icon-remove-sign popover-close" style="float: right;font-size: 1.3rem;color:#a1a1a1; margin:8px 10px 0px 0px; font-weight:600;" data-dismiss="modal" aria-hidden="true"></a><div class="popover-content"></div></div></div>',
              content: function(){
                var contentObj = {'data':dataMaster,'title':$('#'+parentId).closest('.insight-box').find('h1').html()};
                return valueTable(contentObj);
              }
            }).on('show.bs.popover', function(){
              $('body').append('<div class="pop-overlay"></div>');
              $('body').on('click touchend','.pop-overlay,.popover-close', function() {
                pop.popover('hide');
                $('.pop-overlay').remove();
              });
            });/*.click(function(e){
              e.preventDefault();
            });*/

            $(this).popover('show');
         });
  }

  function valueTable(jsonValue){

        var template = $("#data-template").html();
        var compiledTemplate = Handlebars.compile(template);

        var compiledHtml = compiledTemplate(jsonValue);
        return compiledHtml;
  }    

      
  labels = svg.selectAll("g.bar")
      .append("svg:text")
      .attr("class", "value")
      .attr("fill","#707070")
      .attr("font-size","11px")
      .attr('font-family','sans-serif')
      .attr("x", function(d){ return x(d.value) + 10 })
      .attr("text-anchor", "start")
      .text(function(d){return  (d.valueString!=null?d.valueString:d.value);});
          

  var bbox = null;
  
  if(labels.node() != null)
    bbox = labels.node().getBBox();
  
  svg.selectAll(".value")
      .attr("transform", function(d)
      {
          return "translate(0, " + (y.rangeBand()/2 + bbox.height/4) + ")";
      });

  //Axes
  if(bbox != null){
  /*svg.append("svg:line")
      .attr("class", "axes")
      .attr("x1", chart_left)
      .attr("x2", chart_left)
      .attr("y1", chart_bottom)
      .attr("y2", chart_top)
      .attr("stroke", "#939597");
  
  }*/
  }
}
