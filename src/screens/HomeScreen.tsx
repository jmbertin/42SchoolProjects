import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api42 from '../api42/api';

function HomeScreen({navigation, route}) {
  const [projectData, setProjectData] = useState([]);
  const accessToken = route.params?.token;
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [filterCriteria, setFilterCriteria] = useState({
    isSolo: false,
    isSubscriptable: false,
    includeDeprecated: false,
    includePiscine: false,
    includeProfessional: false,
    includeExam: false,
    includeValidated: false,
  });

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const profileDetails = await api42.getUserProfile(accessToken);

        const availableProjects = await api42.getProjectsFromMyCampus(
          accessToken,
          profileDetails.campus[0].id,
        );

        setProjectData(
          availableProjects.map(project => {
            const myProject = profileDetails.projects_users.find(
              p => p.project.id === project.project.id,
            );
            return {
              ...project,
              myProjectStatus: myProject ? myProject.status : null,
              isValidated: myProject ? myProject['validated?'] : null,
              grade: myProject ? myProject.final_mark : null,
            };
          }),
        );
      } catch (error) {
        console.error('Error fetching project data', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, [accessToken]);

  const handleSearch = () => {
    let filtered = projectData.filter(project => {
      const lowerCaseName = project.project.name.toLowerCase();
      const lowerCaseSlug = project.project.slug.toLowerCase();
      const lowerDescription = project.description.toLowerCase();
      const isvalidated = project.isValidated;

      const isDeprecated = lowerCaseName.includes('deprecated');
      const isPiscine =
        lowerCaseName.includes('piscine') ||
        lowerCaseSlug.includes('piscine') ||
        lowerDescription.includes('piscine') ||
        lowerCaseName.includes('cybersecurity') ||
        lowerCaseName.includes('data ') ||
        lowerCaseName.includes('python ');
      const isExam = lowerCaseName.includes('exam');
      const isProfessional =
        lowerCaseName.includes('apprentissage') ||
        lowerCaseName.includes('internship') ||
        lowerCaseName.includes('contract ') ||
        lowerCaseName.includes('part_time ');

      return (
        (filterCriteria.isSolo ? project.solo : true) &&
        (filterCriteria.isSubscriptable ? project.is_subscriptable : true) &&
        (filterCriteria.includeDeprecated ? true : !isDeprecated) &&
        (filterCriteria.includePiscine ? true : !isPiscine) &&
        (filterCriteria.includeProfessional ? true : !isProfessional) &&
        (filterCriteria.includeExam ? true : !isExam) &&
        (filterCriteria.includeValidated ? true : !isvalidated) &&
        (!searchTerm || lowerCaseName.includes(searchTerm.toLowerCase()))
      );
    });
    filtered = filtered.sort((a, b) =>
      a.project.name.localeCompare(b.project.name),
    );

    setFilteredProjects(filtered);
  };

  return (
    <ImageBackground
      source={require('../../images/back.jpg')}
      style={styles.backgroundImage}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text style={styles.loadingText}>
            Loading projects datas, could take up to 1 minute...
          </Text>
        </View>
      ) : (
        <View style={styles.searchContainer}>
          <View style={styles.header}>
            <TextInput
              style={styles.inputText}
              value={searchTerm}
              placeholder="Project name (optional)"
              placeholderTextColor="#c2c3c4"
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}>
              <Ionicons name="search-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.criteriaContainer}>
            <TouchableOpacity
              style={[
                styles.criteriaButtonBy4,
                filterCriteria.isSolo
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() =>
                setFilterCriteria(prev => ({...prev, isSolo: !prev.isSolo}))
              }>
              <Text style={styles.textCriteria}>Solo only</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.criteriaButtonBy4,
                filterCriteria.isSubscriptable
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() =>
                setFilterCriteria(prev => ({
                  ...prev,
                  isSubscriptable: !prev.isSubscriptable,
                }))
              }>
              <Text style={styles.textCriteria}>Subscriptable only</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.criteriaButtonBy4,
                filterCriteria.includeDeprecated
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() =>
                setFilterCriteria(prev => ({
                  ...prev,
                  includeDeprecated: !prev.includeDeprecated,
                }))
              }>
              <Text style={styles.textCriteria}>Include Deprecated</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.criteriaButtonBy4,
                filterCriteria.includeValidated
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() =>
                setFilterCriteria(prev => ({
                  ...prev,
                  includeValidated: !prev.includeValidated,
                }))
              }>
              <Text style={styles.textCriteria}>Include Validated</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.criteriaContainer}>
            <TouchableOpacity
              style={[
                styles.criteriaButtonBy3,
                filterCriteria.includePiscine
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() =>
                setFilterCriteria(prev => ({
                  ...prev,
                  includePiscine: !prev.includePiscine,
                }))
              }>
              <Text style={styles.textCriteria}>Include Piscine</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.criteriaButtonBy3,
                filterCriteria.includeProfessional
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() =>
                setFilterCriteria(prev => ({
                  ...prev,
                  includeProfessional: !prev.includeProfessional,
                }))
              }>
              <Text style={styles.textCriteria}>Include Professional</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.criteriaButtonBy3,
                filterCriteria.includeExam
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() =>
                setFilterCriteria(prev => ({
                  ...prev,
                  includeExam: !prev.includeExam,
                }))
              }>
              <Text style={styles.textCriteria}>Include Exam</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={styles.flatList}
            data={filteredProjects}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
              let backgroundColor;

              if (item.myProjectStatus === 'finished' && item.isValidated) {
                backgroundColor = '#2d9127';
              } else if (item.myProjectStatus === 'finished') {
                backgroundColor = '#ab2e2e';
              } else if (item.myProjectStatus === 'in_progress') {
                backgroundColor = '#ab7d2e';
              } else {
                backgroundColor = '#2c5aa3';
              }
              return (
                <TouchableOpacity
                  style={[styles.listItemContainer, {backgroundColor}]}
                  onPress={() =>
                    navigation.navigate('ProjectDetails', {project: item})
                  }>
                  <Text style={styles.listItemText}>
                    {item.project.slug}{' '}
                    {item.grade != null && ` (${item.grade})`}{' '}
                    {item.myProjectStatus === 'in_progress' && '(in progress)'}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </ImageBackground>
  );
}

const styles = {
  loadingText: {
    fontSize: 16,
    color: '#ecf0f1',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  searchContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3498db',
    backgroundColor: '#3fa83b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginRight: 16,
    backgroundColor: '#1f1f1f',
    color: '#ecf0f1',
    fontSize: 16,
  },
  criteriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
  criteriaButtonBy3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    height: 45,
    margin: 3,
    width: '31%',
  },
  criteriaButtonBy4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    height: 45,
    margin: 3,
    width: '23%',
  },
  activeButton: {
    backgroundColor: '#2ecc71',
  },
  inactiveButton: {
    backgroundColor: '#34495e',
  },
  textCriteria: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  flatList: {
    flex: 1,
  },
  listItemContainer: {
    padding: 15,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    marginVertical: 3,
    marginHorizontal: 15,
  },
  listItemText: {
    fontSize: 18,
    color: '#ecf0f1',
    textAlign: 'center',
  },
};

export default HomeScreen;
