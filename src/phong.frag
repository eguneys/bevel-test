precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;

//uniform float transformX;
//uniform float transformY;

const float transformX = 20.0;
const float transformY = 20.0;

const float divisions = 100.0;

bool isalpha(vec2 uv, vec2 offset) {
  vec4 color = texture2D(uSampler, uv - offset);

  return color.a < 0.001;
}

float getdistancetoedge(vec2 uv) {
  float mindistance = 1.0;
  vec2 dir = vec2(1.0 / filterArea) * vec2(transformX, transformY);

  for (int i=0; i <= int(divisions); i++) {
    vec2 vdist = dir * float(i) / divisions;
    bool alpha = isalpha(uv, vdist);

    if (alpha) {
      mindistance = min(float(i)/divisions, mindistance);
    }
  }
  return mindistance;
}


const float Kd = 0.6;
const float Ks = 0.5;
const vec3 specularColor = vec3(1.0);
//const float shininessVal = 4.0;

uniform float shininessVal;
uniform vec3 lightPos;
uniform float vertZ;

void main(void) {
  vec4 color = texture2D(uSampler, vTextureCoord);

  vec3 vertPos = vec3(-vTextureCoord * 1.5, vertZ);

  float dist = getdistancetoedge(vTextureCoord);
  float na = 3.1415 * 0.5 + atan(0.5, dist);

  mat2 rotation = mat2(cos(na), -sin(na), sin(na), cos(na));
  vec2 x_axis = vec2(1.0, 0.0);
  vec2 u_normal = rotation * x_axis;


  vec3 N = vec3(u_normal, 1.0);
  vec3 L = normalize(lightPos - vertPos);
  float specular = 0.0;
  float lambertian = max(dot(N, L), 0.0);

  vec3 R;
  vec3 V;
  float specAngle;
  if (lambertian > 0.0) {
    R = reflect(-L, N);
    V = normalize(-vertPos);
    specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }
  
  color = vec4(Kd * lambertian * color.rgb + Ks * specular * specularColor, 1.0);
  gl_FragColor = vec4(color.rgb * color.a, color.a);
}
