import React, { useEffect, useState, useRef} from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import panzoom from 'panzoom';
import { makePoints, hilbert, rot } from '../lib/util';

const map_terrain_urls = [
    "/img/terrain/city.png",
    "/img/terrain/sand.png",
    "/img/terrain/grass.png",
    "/img/terrain/mountain.png",
]

const colors = [
    "#050505",
    "#e99400",
    "#4de900",
    "#7900e9",
]


const ownership: number[] = [10, 11, 100, 101, 102, 103, 1000];

const terrains = Array.from({length: 10000}, () => (Math.floor(Math.random() * map_terrain_urls.length)));

const HexGrid = () => {


    const [data, setData] = useState<[number, number][]>([]);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [hexRadius, setHexRadius] = useState<number>(0);
    const [startX, setStartX] = useState<number>(0);
    const [startY, setStartY] = useState<number>(0);
    const [mapRows, setMapRows] = useState<number>(0);
    const [mapCols, setMapCols] = useState<number>(0);
    const [didZoom, setDidZoom] = useState<boolean>(false);

    useEffect(() => {
        if(didZoom) {
            setTimeout(() => {
                setDidZoom(false);
            }, 500);
        }

    }, [didZoom]);

    function fadeAllImages() {
        // d3.selectAll('.svg_fg_img_tmp_highlighted').attr("class", "svg_fg_img_tmp").transition().duration(200).style("opacity", 0);
        d3.selectAll('.hex_not_owned_highlighted')
          .attr("class", "hex_not_owned")
          .style("stroke-width", 0.01)
            .transition()
            .duration(1000)
            .style("fill-opacity", 0.01)
            
        d3.selectAll('.hex_owned_highlighted')
        .attr("class", "hex_owned")
        .style("stroke-width", 0.05)
          .transition()
          .duration(1000)
          .style("fill-opacity", 0.03)
          
      }

    

    function mover(d: MouseEvent|TouchEvent) {
        d.stopPropagation();
        showImage(Number((d.target as HTMLElement).dataset.position));
      }
      
      //Mouseout function
      function mout(d: MouseEvent|TouchEvent) {
        fadeAllImages();
      };
    
    function mclick(d: MouseEvent|TouchEvent) {

        if (!didZoom) {
            if(ownership.includes(Number((d.target as HTMLElement).dataset.position))) {
                console.log("Owned")
            } else {
                console.log("Unowned")
            }
        }
    }


    function showImage(position: number) {
    
        
        let img = document.getElementById(`fgimg_${position}`);
        if(!img){
          console.log("Doesn't exist");
          d3.select("svg").select("g")
          .append("image")
             .attr("class", "svg_fg_img_tmp_highlighted")
             .attr("xlink:href", function(dt) {
                  return map_terrain_urls[terrains[position]];
                }
             )
             .attr("id", function(dt) {
                return `fgimg_${position}`;
              }
            )
            .attr("opacity", 1)
            .attr("x", function(dt) { return data[position][0] * 2 - (hexRadius*3); })
            .attr("y", function(dt) { return data[position][1] * 2 - (hexRadius*3) ; })
            .attr("width", hexRadius*6)
            .attr("height", hexRadius*6)
            .attr("data-position", function (dt) {
              return position;
            })
            .attr("data-fg", function (dt) {
              return position;
            })
            .on("mouseover", mover)
            .on("mouseout", mout)
            .on("click", mclick);
    
        } else {
          console.log("Exists");
          d3.select(img)
            .attr("class", "svg_fg_img_tmp_highlighted")
            .transition()
            .duration(10)		  
            .style("opacity", 1);
        }
    
        d3.select(`#hex_${position}`)
          .attr("class", function() {
            if(ownership.includes(position)) {
                //return "#000";
                return "hex_owned_highlighted";
              }
            return "hex_not_owned_highlighted";
          })
          .style("stroke-width", 0.5)
          .transition()
          .duration(10)
          .style("fill-opacity", 0.05)
    
      }
    
    useEffect(() => {
        var width = window.innerWidth,
        height = window.innerHeight;
        console.log(width, height);
    
      const hR = Number(d3.min([width/((100 + 0.5) * Math.sqrt(3)),height/((100 + 1/3) * 1.5)]));
        setHexRadius(hR);
        const _data = makePoints(100, 100, hR);
      
        setData(_data);
    }, []);

    useEffect(() => {
      if(hexRadius != 0 && data.length > 0) {

      
    
        const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);
    
        let center = [0,0];

        
    
    const vector = svg.append("g");  // holds hexagons
    var hexes;					   // to hold hexagons
    
    // Hexbin:
    var d3hexbin = hexbin()
        .radius(hexRadius)
        .extent([[0, 0], [1, 1]]); // extent of the one pixel projection.


    const center_x: number[] = [];
    const center_y: number[] = [];

    var image = vector
        .selectAll("image");
        
        image.data(d3hexbin(data))
        .enter()
        .append("image")
            .attr("class", "svg_fg_img")
            .attr("xlink:href", function(d, i) {
                return map_terrain_urls[terrains[i]];
                }
            )
            .attr("id", function(d, i) {
                return `fgimg_${i}`;
            }
            )
            .attr("x", function(d) { return d.x * 2 - (hexRadius*3); })
            .attr("y", function(d) { return d.y * 2 - (hexRadius*3) ; })
            .attr("width", hexRadius*6)
            .attr("height", hexRadius*6)
            .attr("data-position", function (d,i) {
            return i;
            })
            .attr("data-fg", function (d,i) {
            return i;
            })
            // .on("mouseover", mover)
            // .on("mouseout", mout)
            // .on("click", mclick);
    
    
    // Create hex bins:
    hexes = vector.selectAll()
        .data(d3hexbin(data))
        .enter()
        .append("path")
        .attr("d", function (d) {
            return "M" + d.x + "," + d.y + d3hexbin.hexagon(hexRadius*1.98);
        })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("stroke", function (d,i) {
            if(ownership.includes(i)) {
            //return "#000";
            center = [d.x * 2 - (hexRadius*2) , d.y * 2 - (hexRadius*2) ]
            center_x.push(d.x * 2 - (hexRadius*2));
            center_y.push(d.y * 2 - (hexRadius*2));
            
            }
            /*
            for(var v of fg_data.flower_girls[i].cm){
            if(steps[num_step].hasOwnProperty(v)){
                return fg_data.flower_girls[i].c;
                console.log("yep")
            }
            }*/
        // return "#fff";
        return colors[terrains[i]] + "aa";
        })
        .attr("class", function (d,i) {
        if(ownership.includes(i)) {
            return "hex_owned";
        }
        return "hex_not_owned";
        })
        .attr("data-position", function (d,i) {
        return i;
        })
        .attr("id", function (d,i) {
        return `hex_${i}`;
        })
        .attr("data-fg", function (d,i) {
        return i;
        })
        .attr("stroke-width", function (d, i) {
            if(ownership.includes(i)) {
            //return "#000";
            return 0.05;
            
            }
            /*
            for(var v of fg_data.flower_girls[i].cm){
            if(steps[num_step].hasOwnProperty(v)){
                return fg_data.flower_girls[i].c;
                console.log("yep")
            }
            }*/
        // return "#fff";
        return 0.01;
        })
        .style("fill", function (d,i) {
        return colors[terrains[i]] + "aa";
        })
        .style("fill-opacity", function(d,i) {
        if(ownership.includes(i)) {
            //return "#000";
            return 0.05;
            }
        return 0.01;
        })
        .on("mouseover", mover)
        .on("mouseout", mout)
        .on("click", mclick);

        
        
        
        var instance = vector.node() ? panzoom(vector.node() as SVGElement , {
        onTouch: function(e) {
            // `e` - is current touch event.
            console.log("touch");
            mover(e);
            mclick(e);
            mout(e);
            return true; // tells the library to not preventDefault.
        },
        bounds: true,
        boundsPadding: 1,
        }) : null;
        if (instance) {
            let goToX, goToY;
            if(center_x.length > 0) {
            goToX = center_x.reduce((a, b) => a + b) / center_x.length;
            } else { goToX = 50 }
            
            if(center_y.length > 0) {
                goToY = center_y.reduce((a, b) => a + b) / center_y.length;
            } else { 
                goToY = 50 
            }
            
            if(center_x && center_y) {
                instance.smoothZoom(goToX*1.1, goToY*1.1, 6);
            }
            instance.on('transform', function(e: Event) {
                setDidZoom(true);
            });


        }

    
    

    // svg.attr("transform","translate(" + -center[0] + "," + -center[1] + ") scale(6)")

    }

    }, [hexRadius, data.length]);

    return (
        <svg id='sphere' className="w-full h-[calc(100vh_-_10rem)] flex-1 bg-amber-100" >

        </svg>
    );
};

export default HexGrid;

