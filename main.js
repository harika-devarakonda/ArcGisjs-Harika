
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/layers/FeatureLayer",
], function(Map,MapView,GraphicsLayer,SketchViewModel,FeatureLayer){

  // Create a map and view
  const map = new Map({
    basemap: "streets"
  });

  const view = new MapView({
    container: "viewMap",
    map: map,
    center: [80, 13],
    zoom: 7 
  });

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  const sketchViewModel = new SketchViewModel({
    layer: graphicsLayer,
    view: view,
    polygonSymbol: {
      type: "simple-fill",
      color: [51, 122, 183, 0.5],
      outline: {
        color: "white",
        width: 1
      }
    }
  });

  let closer=document.getElementById('popup-closer');
  closer.onclick=function(){
    document.getElementById("popup").style.display = "none";
  }
  document.getElementById("createFeatureButton").addEventListener("click", function() {
    sketchViewModel.create("polygon");
    document.getElementById("popup").style.display = "none";
  });

  // Open popup when clicking the button
  document.getElementById("createButton").addEventListener("click", function() {
    document.getElementById("popup").style.display = "block";
  });

//   json data for adding attributes``
let geojson=[];
fetch("sample.json")
.then(response=>response.json()
).then(data=>{
    geojson=data.features
}
)
    view.on("double-click", function(event) {
        event.stopPropagation();
        view.hitTest(event).then(function(response) {
          if (response.results.length > 0) {
            const graphic = response.results.filter(result => result.graphic.layer === graphicsLayer)[0];
            if (graphic) {
                let final= document.createElement("p");
                let content;
               content = `
                <table class="table table-bordered table-striped">
                    <tbody>
                         <th class="text-start">Id</th>
                            <td><input type="number" placeholder="${geojson.length+1}" value="${geojson.length+1}" class="form-control" readonly ></td>
            `;
        
                    let firstFeatureProperties = geojson[0].properties;
                    for (let key in firstFeatureProperties  ) {
                        if (firstFeatureProperties.hasOwnProperty(key)) {
                            if (key === 'city') {
                              
                                let options = firstFeatureProperties[key].map(option => `<option value="${option}">${option}</option>`).join('');
                                content += `
                                    <tr>
                                        <th class="text-start">${key[0].toUpperCase() + key.slice(1)}</th>
                                        <td class="text-end">
                                            <select id="${key}" class="form-select">
                                                ${options}
                                            </select>
                                        </td>
                                    </tr>
                                `;
                            } else {
                            content += `
                            <tr>
                       
                                <th class="text-start">${key[0].toUpperCase() + key.slice(1)}</th>
                                <td class="text-end">
                                    <input type="text" id="${key}" placeholder="${key[0].toUpperCase() + key.slice(1)}" value="" class="form-control">
                                </td>
                            </tr>
                        `;
         
                        }
                    }
                }
                    content += '</tbody></table>';
                    
                    final.innerHTML = content;

          view.popup.open({
            title: "Feature Attributes",
            location: event.mapPoint,
            content: final
          });
      
            }
          }
        });
      });


}

)

