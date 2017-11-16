# datadashboard
A Javascript based data visualisation programme. The main library being used is D3.

## Early set-up and notes

### 1. Set-up d3 and simple node server (https://github.com/indexzero/http-server)
```
>>> npm install d3
>>> npm install d3-collection
>>> npm install http-server
>>> npm install d3-dsv
```
```
>>> cd /path/to/dir
>>> http-server
```
In browser: open http://0.0.0.0:8080

### 2. Have csv (or other simple data format ready)

### 3. Convert data into an array of objects

Simple option:

```
d3.csv("/data/test.csv", function(data) {
  console.log(data[0]);
});
```

### 4. Complex option (if you need to rename headers and want to do more pre-processing of the data):

```
d3.csv("/data/cities.csv", function(d) {
  return {
    city : d.city,
    state : d.state,
    population : +d.population,
    land_area : +d["land area"]
  };
}, function(data) {
  console.log(data[0]);
});
```

### 5. Stuff about loading multiple data sources:
Loading Multiple Files section - http://learnjsdata.com/read_data.html

### 6. Combining multiple data sources:
http://learnjsdata.com/combine_data.html

### 7. Grouping data:
http://learnjsdata.com/group_data.html
